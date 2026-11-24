# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope

Flipper Zero apps written with the **JS API** only (https://developer.flipper.net/flipperzero/doxygen/js.html). No compiled `.fap` apps (C, ufbt) for now. The project was generated with `@flipperdevices/create-fz-app` and uses `@flipperdevices/fz-sdk` (types plus the build/upload tool). Package manager is pnpm.

See `LESSONS.md` for the device gotchas in full and `README.md` for the public overview.

## Commands

- `npm run build`: `tsc` (type check and emit to `dist/`), then the SDK bundles `dist/index.js` into `dist/flipper-js-playground.js`.
- `npm start`: build, then upload to the Flipper over USB to `/ext/apps/Scripts/flipper-js-playground.js` and run it. `print()` output appears in the terminal.
- `pnpm run verify`: the full gate. Runs `lint` (Biome, warnings count as errors), then `build`, then `check:bundle`. Run it after every change.
- `pnpm run lint` / `lint:fix`: Biome check, and check with safe fixes applied. Biome config is `biome.json` (4-space indent, `noExplicitAny`, `useTemplate` and `noInvalidBuiltinInstantiation` are off on purpose: mJS style and the SDK's `Uint8Array()` typing).
- `pnpm run check:bundle`: fails if `dist/flipper-js-playground.js` contains esbuild module helpers (`__toESM`, `__commonJS`) or a brace-less `else`, both of which mJS cannot run.
- A Stop hook (`.claude/settings.json` running `scripts/claude-verify.sh`) runs `verify` when Claude finishes a turn and sends failures back to be fixed. It cannot catch device-only problems (RAM, firmware, unhandled events).
- There is no test runner. `tsc` (inside build) is the type check.
- Build and upload settings live in `fz-sdk.config.json5` (`minify`, output path). Keep `minify` off while debugging.

## Architecture

`index.ts` is the entry point. It builds the root menu from a list of `Screen` objects and hands it to the router.

- `lib/modules.ts`: the only place firmware modules are loaded. `event_loop` and `gui` load eagerly, in that required order. View modules (`gui/dialog` etc.) are `loadX()` functions so they load on demand. Add new modules here.
- `lib/screen.ts`: the `Screen` type: `title`, plus either `create()` (lazy, builds the view on first open) or `view` (eager), and an optional `onEnter()` that runs on every open.
- `lib/router.ts`: the only code that calls `switchTo` or subscribes to `viewDispatcher.navigation`. `open(screen)` goes forward, `back()` returns, and back at the root stops the app.
- `lib/menu.ts`: `createMenu(title, header, screens)` returns a submenu as a `Screen`, so menus nest.
- `screens/*.ts`: one file per feature, exporting a `Screen`.
- `lib/button_grid.ts`: reusable rich button grid on the button panel view. Buttons have normal, hover (firmware-drawn) and pressed (redrawn from `press`/`release` events) icons plus `onPress`/`onRelease`/`onClick`/`onLongPress` handlers. State lives on a `ButtonGrid` object passed as the subscribe extra arg. Demo: `screens/components/rich_buttons.ts`. Unverified on a device: which event types the panel sends, and whether `setChildren` keeps the focused button.
- `screens/components/`: a gallery menu of every SDK GUI view, one demo file each (dialog, submenu, button menu/panel, rich buttons, icon menu, option list, text/number/byte input, file picker, text box, widget, icons, popup, loading, empty screen). `dialog.ts` is the template to copy.

To add a feature: create `screens/<name>.ts` exporting a `Screen` with a `create()`, then add it to a menu list (`index.ts` or `screens/components/index.ts`). A screen's handlers call `back()` and never touch `switchTo`.

## Constraints that shape the code

- Engine is **mJS**, not Node or a browser. No closures: event callbacks must be top-level functions that read module-level state (or take extra args via `eventLoop.subscribe(contract, cb, ...args)`). Avoid array methods like `pop`, and use index access (see the stack in `lib/router.ts`). Not verified on a device: array method support in mJS.
- Each event source takes one callback. That is why back handling is centralised in the router.
- Pass state to a callback as extra `subscribe` args (e.g. the view, or a menu's screen list), not by capturing it. Demo handlers do `onInput(_sub, button, view)` with `subscribe(view.input, onInput, view)`.
- Build views lazily in `create()` and load view modules through `loadX()`. Each view module is a plugin held in RAM. Creating all of them at startup risks running out of memory.
- Views that take children arrays of objects (button menu/panel, widget) are typed `any[]` in the demos: with `noLib` TS widens the discriminant strings and rejects the literals. `noLib` also means no `Parameters`/`ReturnType` utility types.
- Observed on a real device, not stated in the SDK docs:
  - Requiring the same module twice throws `"<module>" module is already installed`. Load modules only through the cached `loadX()` functions in `lib/modules.ts`, never with a direct `require`.
  - The widget demo crashed with `furi_check failed` when a button element was pressed with no `view.button` subscriber. Subscribing fixed it (confirm on device if in doubt), so subscribe to the events a view really emits.
  - Typings can list events that do not exist on the device. `text_box`'s `chosen` is declared in the SDK `.d.ts` but is `undefined` at runtime, and `eventLoop.subscribe(undefined, ...)` fails with `expected pointer`. Do not subscribe to an event just because the typings list it. Test each one on the device.
  - String + number throws `implicit type conversion is prohibited`. Convert with `n.toString()` (`Number.toString` is in the SDK typings), e.g. `"clicks " + clicks.toString()`. `tsc` and Node accept the implicit form, so only the device catches it.
  - mJS failed to parse a brace-less `if (...) a(); else b();` ("parse error ... [else"). Always use braces when there is an `else`. esbuild keeps the source's braces, so this is checked in the source, not the bundle.
  - `"gui/widget" module load fail` happened once. The cause is undiagnosed (missing firmware plugin or out of RAM) and it worked later.
- The loading view swallows the back key, so a screen using it must leave on its own (see `screens/components/loading.ts`).
- The SDK type definitions use `export =`. Under `import * as x`, esbuild adds a `__toESM` helper that mJS likely cannot run, so load modules with the typed `require` in `lib/modules.ts`.
- Multi-file works through two tsconfig settings: `"module": "ESNext"` (so esbuild flattens modules into one scope instead of emitting `__commonJS` closure wrappers) and `skipLibCheck` (the SDK `.d.ts` files use `export =`, which errors under ESNext). The Flipper docs say multiple `.ts` files cannot be imported yet. This setup works around it, but has only been checked by inspecting `dist/flipper-js-playground.js`, not on a device. After any build or tsconfig change, check the output has no `__commonJS`, `__toESM` or `__getOwn` helpers.
- Callbacks receive `(subscription, item, ...extraArgs)`. Leave callback parameters unannotated: annotating `item` fails type checking because `Contract` carries its item type only as a phantom.
- Submenu items are passed as children: `submenu.makeWith({ header }, titles)`. The `items` prop in older docs is outdated.
- Firmware module API docs: `https://developer.flipper.net/flipperzero/doxygen/js_<module>.html`. Types are in `node_modules/@flipperdevices/fz-sdk/`.
