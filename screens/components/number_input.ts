import { eventLoop, loadNumberInput } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onInput(_sub, value, view) {
    view.set("header", "Got: " + value.toString());
}

function create() {
    const view = loadNumberInput().makeWith({
        header: "Number input",
        minValue: 0,
        maxValue: 100,
        defaultValue: 42,
    });
    eventLoop.subscribe(view.input, onInput, view);
    return view;
}

export const numberInputDemo: Screen = { title: "Number input", create: create };
