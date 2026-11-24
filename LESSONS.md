# Lessons learnt: Flipper Zero JS API vs a FAP

Notes from building this playground with the JS API (mJS, TypeScript, `@flipperdevices/fz-sdk` 1.0), tested on a real Flipper. The firmware version was not recorded, so add yours when you try this. Each claim is tagged:

- **Observed**: happened on the device during this project.
- **Docs**: stated in the SDK or Flipper documentation.
- **General**: general knowledge about FAPs. **Not tested in this repo.**

## JS API

### Pros
- **Tiny toolchain (observed).** Node and pnpm only. `pnpm start` type checks, bundles, uploads over USB and runs the script, and `print()` output appears in the terminal.
- **Fast loop (observed).** Edit, run, see it on the device in seconds, with no flashing.
- **Native-looking UI for free (observed).** The stock views (dialog, submenu, text and number input, popup and so on) match the system look and handle navigation and keyboards for you.
- **TypeScript works (observed).** The SDK ships typings, and esbuild bundles several source files into one script once configured (see below).
- **Low risk (observed).** A script error stops the script and prints a trace. It does not brick the device.

### Cons
- **Only the views the SDK offers (docs).** Raw canvas drawing is not available from JS. There are seven built-in icons. A custom look, like a button with a real pressed state, means working around the views.
- **mJS is a small dialect (observed).** The engine is not Node or a browser, and every item below crashed or failed on the device.
- **Typings and docs can be wrong (observed).** See the table.
- **Terse errors (observed).** Messages like `expected pointer` or `module load fail` give a line number in the bundle and little else. `tsc` and Node cannot catch these problems, so every one was found on the device.
- **Memory is tight (observed, cause unconfirmed).** Each view module is a plugin held in RAM until the script exits. One `"gui/widget" module load fail` appeared once and went away. We never diagnosed it (missing firmware plugin or out of RAM).

### Gotchas we hit (all observed)

| Symptom on the device | Cause | Fix |
|---|---|---|
| `"gui/submenu" module is already installed` | The same module was `require`d twice (several screens shared a module) | Load every module once through a cache (`lib/modules.ts`) |
| `parse error ... [else` | Brace-less `if (x) a(); else b();` | Always use braces when there is an `else` |
| `implicit type conversion is prohibited` | `"text " + someNumber` | `someNumber.toString()` |
| `expected pointer` | Subscribed to `view.chosen` on the text box. The typings declare it, the device has no such event | Only subscribe to events you have tested on the device |
| `furi_check failed` | Pressed a widget button element with no subscriber on `view.button` (likely cause, confirmed only by the crash stopping after subscribing) | Subscribe to the events a view really emits |
| Back key does nothing in the loading view | The loading view swallows the back key | Leave the screen with a timer |
| App fails at startup with many views | Creating every view and loading every module up front | Build views lazily on first open |
| Closures do not work | mJS has no closures | Pass state as extra `eventLoop.subscribe` args, use top-level functions |
| Bundle crashes or fails to load | esbuild wrapped modules in `__commonJS` and `__toESM` helpers that need features mJS lacks | `"module": "ESNext"` in `tsconfig.json`, plain typed `require` instead of `import * as`, and `scripts/check-bundle.mjs` to catch regressions |

### Still unresolved
- **Button panel events.** One log showed `press` then `short` and no `release`. It also showed a `press` at index 3 followed by a `short` at index 0, which we could not explain. The rich button demo assumes the event `index` is reliable, and that may be wrong.
- **Does `setChildren` keep focus?** The rich button redraws the panel on press. We have not confirmed that focus survives.
- **Custom icons.** `loadFxbm(path)` loads `.fxbm` sprites. The format comes from the `flipperzero-game-engine` repo's `scripts/sprite_builder.py`, which needs Pillow. The bit order and a good SD card path are unverified, and we have not tried it.
- **Docs say multiple `.ts` files cannot be imported yet.** Multi-file worked here with the tsconfig changes above, but it is outside what the docs promise.

## FAP (compiled C app, built with `ufbt`)

All of this is **general knowledge, not tested in this repo.**

### Pros
- **Full firmware API.** Custom drawing through a `ViewPort` draw callback, and raw input callbacks, so a pressed state, long press and repeat are yours to define.
- **Real assets.** Icons compile from PNGs through the build tooling.
- **Better diagnostics.** Proper logging and crash output, and C tooling.
- **Fewer runtime surprises.** A real compiler catches type errors that mJS only reports on the device.
- **No dialect to work around.**

### Cons
- **C and manual memory management.** More code and more ways to crash.
- **Heavier toolchain.** `ufbt` and the firmware SDK, with builds that are slower than editing a script.
- **API version coupling.** The app has to match the firmware's API version.
- **Larger blast radius.** A bug can take down the whole device UI until it is restarted.

## Which one to use

| Need | Pick |
|---|---|
| Glue scripts, GPIO or BadUSB tasks, simple menus and forms | JS |
| Quick experiments and demos | JS |
| A custom look and feel (pressed states, animations, games) | FAP |
| Tight memory or timing control | FAP |
| Sharing with people who will not build C | JS |

In this project the JS version got awkward exactly where we tried to build a rich button. That work is the strongest argument for a FAP, and the most natural fit for the next experiment.
