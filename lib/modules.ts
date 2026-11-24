// Single place where firmware modules are loaded.
//
// Why `require` instead of `import * as`: with several source files esbuild
// would wrap `import * as` in a `__toESM` helper that needs JS features mJS
// may not have. A plain `require` is left as-is, and the cast keeps types.
//
// Order matters: `event_loop` first, then `gui`, then gui submodules.
export const eventLoop =
    require("@flipperdevices/fz-sdk/event_loop") as typeof import("@flipperdevices/fz-sdk/event_loop");
export const gui = require("@flipperdevices/fz-sdk/gui") as typeof import("@flipperdevices/fz-sdk/gui");

// The firmware throws '"<module>" module is already installed' if the same
// module is required twice, and several screens share modules, so every load
// goes through this cache.
const cache: any = {};
function load(name: string): any {
    if (!cache[name]) cache[name] = require(name);
    return cache[name];
}

// View modules are loaded on demand (each one is a plugin that takes RAM), so
// call these from a screen's `create()` rather than at the top of the file.
export function loadSubmenu() {
    return load("@flipperdevices/fz-sdk/gui/submenu") as typeof import("@flipperdevices/fz-sdk/gui/submenu");
}
export function loadDialog() {
    return load("@flipperdevices/fz-sdk/gui/dialog") as typeof import("@flipperdevices/fz-sdk/gui/dialog");
}
export function loadButtonMenu() {
    return load("@flipperdevices/fz-sdk/gui/button_menu") as typeof import("@flipperdevices/fz-sdk/gui/button_menu");
}
export function loadButtonPanel() {
    return load("@flipperdevices/fz-sdk/gui/button_panel") as typeof import("@flipperdevices/fz-sdk/gui/button_panel");
}
export function loadIconMenu() {
    return load("@flipperdevices/fz-sdk/gui/menu") as typeof import("@flipperdevices/fz-sdk/gui/menu");
}
export function loadTextInput() {
    return load("@flipperdevices/fz-sdk/gui/text_input") as typeof import("@flipperdevices/fz-sdk/gui/text_input");
}
export function loadNumberInput() {
    return load("@flipperdevices/fz-sdk/gui/number_input") as typeof import("@flipperdevices/fz-sdk/gui/number_input");
}
export function loadByteInput() {
    return load("@flipperdevices/fz-sdk/gui/byte_input") as typeof import("@flipperdevices/fz-sdk/gui/byte_input");
}
export function loadTextBox() {
    return load("@flipperdevices/fz-sdk/gui/text_box") as typeof import("@flipperdevices/fz-sdk/gui/text_box");
}
export function loadWidget() {
    return load("@flipperdevices/fz-sdk/gui/widget") as typeof import("@flipperdevices/fz-sdk/gui/widget");
}
export function loadPopup() {
    return load("@flipperdevices/fz-sdk/gui/popup") as typeof import("@flipperdevices/fz-sdk/gui/popup");
}
export function loadLoading() {
    return load("@flipperdevices/fz-sdk/gui/loading") as typeof import("@flipperdevices/fz-sdk/gui/loading");
}
export function loadEmptyScreen() {
    return load("@flipperdevices/fz-sdk/gui/empty_screen") as typeof import("@flipperdevices/fz-sdk/gui/empty_screen");
}
export function loadViList() {
    return load("@flipperdevices/fz-sdk/gui/vi_list") as typeof import("@flipperdevices/fz-sdk/gui/vi_list");
}
export function loadFilePicker() {
    return load("@flipperdevices/fz-sdk/gui/file_picker") as typeof import("@flipperdevices/fz-sdk/gui/file_picker");
}
export function loadIcon() {
    return load("@flipperdevices/fz-sdk/gui/icon") as typeof import("@flipperdevices/fz-sdk/gui/icon");
}
