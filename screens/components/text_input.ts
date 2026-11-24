import { eventLoop, loadTextInput } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onInput(_sub, text, view) {
    view.set("header", "Got: " + text);
}

function create() {
    const view = loadTextInput().makeWith({
        header: "Text input",
        minLength: 0,
        maxLength: 16,
        defaultText: "hello",
        defaultTextClear: true,
    });
    eventLoop.subscribe(view.input, onInput, view);
    return view;
}

export const textInputDemo: Screen = { title: "Text input", create: create };
