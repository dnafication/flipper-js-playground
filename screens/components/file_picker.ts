// pickFile() is a blocking call that shows the system file browser, so this
// screen is a dialog that launches it.
import { eventLoop, loadDialog, loadFilePicker } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onInput(_sub, button, view) {
    if (button !== "center") return;
    const path = loadFilePicker().pickFile("/ext", "*");
    view.set("text", path ? path : "Cancelled");
}

function create() {
    const view = loadDialog().makeWith({
        header: "File picker",
        text: "Pick a file from the SD card",
        center: "Pick",
    });
    eventLoop.subscribe(view.input, onInput, view);
    return view;
}

export const filePickerDemo: Screen = { title: "File picker", create: create };
