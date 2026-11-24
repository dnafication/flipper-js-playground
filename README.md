# flipper-js-playground

A playground of [Flipper Zero JS API](https://developer.flipper.net/flipperzero/doxygen/js.html) demos, written in TypeScript. It has a gallery of every GUI view the SDK offers, a reusable "rich button" grid, and a small screen/router structure that keeps multi-screen apps tidy.

See [LESSONS.md](LESSONS.md) for what we learnt, including the mJS gotchas and how the JS API compares with a FAP.

## Requirements
- Node.js and [pnpm](https://pnpm.io)
- A Flipper Zero with firmware that supports the JS app, connected over USB, for `pnpm start`

## Usage
```sh
pnpm install
pnpm start        # type check, bundle, upload to the Flipper and run
pnpm run verify   # lint (Biome), build and mJS-safety check, no device needed
```

The script is uploaded to `/ext/apps/Scripts/flipper-js-playground.js` (see `fz-sdk.config.json5`). You can also run it from **Apps > Scripts** on the device. `print()` output only appears in the terminal when you start it from the computer.

## Layout
- `index.ts`: entry point, builds the root menu
- `lib/`: `modules.ts` (cached module loading), `router.ts` (navigation and back stack), `menu.ts`, `screen.ts` (the `Screen` type), `button_grid.ts` (rich buttons)
- `screens/`: one file per feature, and `screens/components/` with a demo of each GUI view

To add a screen, copy `screens/components/dialog.ts`, export a `Screen`, and add it to a menu list. `CLAUDE.md` has the detailed conventions and constraints.

## Status
Tested by hand on one device. Some behaviour is unverified, and `LESSONS.md` lists what. Custom icons and the rich button's pressed state are experimental.

## Licence
No licence has been chosen yet.
