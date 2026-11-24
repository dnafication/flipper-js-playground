import { eventLoop, loadButtonMenu } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onInput(_sub, event, view) {
    view.set("header", event.type + " on #" + event.index.toString());
}

function create() {
    // typed `any[]`: with noLib, TS widens the discriminant strings and rejects the literals
    const children: any[] = [
        { type: "common", label: "Common 1" },
        { type: "common", label: "Common 2" },
        { type: "control", label: "Control" },
    ];
    const view = loadButtonMenu().makeWith({ header: "Button menu" }, children);
    eventLoop.subscribe(view.input, onInput, view);
    return view;
}

export const buttonMenuDemo: Screen = { title: "Button menu", create: create };
