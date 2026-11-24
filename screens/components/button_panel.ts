import { eventLoop, loadButtonPanel, loadIcon } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onInput(_sub, event) {
    print("button panel:", event.type, "index", event.index);
}

function create() {
    const icon = loadIcon();
    // typed `any[]`: with noLib, TS widens the discriminant strings and rejects the literals
    const children: any[] = [
        {
            type: "button",
            matrixX: 0,
            matrixY: 0,
            x: 8,
            y: 8,
            icon: icon.getBuiltin("power_19x20"),
            iconSelected: icon.getBuiltin("power_hover_19x20"),
        },
        {
            type: "button",
            matrixX: 1,
            matrixY: 0,
            x: 36,
            y: 8,
            icon: icon.getBuiltin("off_19x20"),
            iconSelected: icon.getBuiltin("off_hover_19x20"),
        },
        {
            type: "button",
            matrixX: 0,
            matrixY: 1,
            x: 8,
            y: 34,
            icon: icon.getBuiltin("off_19x20"),
            iconSelected: icon.getBuiltin("off_hover_19x20"),
        },
        {
            type: "button",
            matrixX: 1,
            matrixY: 1,
            x: 36,
            y: 34,
            icon: icon.getBuiltin("power_19x20"),
            iconSelected: icon.getBuiltin("power_hover_19x20"),
        },
        { type: "label", x: 70, y: 24, font: "primary", text: "Button" },
        { type: "label", x: 70, y: 40, font: "primary", text: "panel" },
    ];
    const view = loadButtonPanel().makeWith({ matrixSizeX: 2, matrixSizeY: 2 }, children);
    eventLoop.subscribe(view.input, onInput);
    return view;
}

export const buttonPanelDemo: Screen = { title: "Button panel (grid)", create: create };
