// The only module that calls `switchTo` or subscribes to `navigation`.
// Screens call `back()` to return. Menus call `open()` to go forward.
//
// Note: mJS has no closures, so callbacks here are top-level functions that
// read module-level state, and the stack uses plain index access rather than
// array methods.

import type { View } from "@flipperdevices/fz-sdk/gui";
import { eventLoop, gui } from "./modules";
import type { Screen } from "./screen";

const MAX_DEPTH = 8;
const stack: View<any, any>[] = [];
let depth = 0;

function show(screen: Screen): void {
    if (!screen.view && screen.create) screen.view = screen.create();
    gui.viewDispatcher.switchTo(screen.view);
}

/** Open a screen on top of the current one */
export function open(screen: Screen): void {
    if (depth >= MAX_DEPTH) return;
    stack[depth] = gui.viewDispatcher.currentView;
    depth = depth + 1;
    show(screen);
    if (screen.onEnter) screen.onEnter();
}

/** Return to the previous screen, or exit the app when already at the root */
export function back(): void {
    if (depth === 0) {
        eventLoop.stop();
        return;
    }
    depth = depth - 1;
    gui.viewDispatcher.switchTo(stack[depth]);
}

function onNavigation(): void {
    back();
}

/** Show `root`, handle the back key globally and run the app until it exits */
export function run(root: Screen): void {
    eventLoop.subscribe(gui.viewDispatcher.navigation, onNavigation);
    show(root);
    eventLoop.run();
}
