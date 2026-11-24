import { eventLoop, loadDialog } from "../lib/modules";
import { back } from "../lib/router";
import type { Screen } from "../lib/screen";

function onInput(_sub, button) {
    if (button === "center") back();
}

function create() {
    const view = loadDialog().makeWith({
        header: "About",
        text: "flipper-js-playground\nFlipper Zero JS API demos",
        center: "Back",
    });
    eventLoop.subscribe(view.input, onInput);
    return view;
}

export const about: Screen = { title: "About", create: create };
