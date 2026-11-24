// Widget lets you compose elements (text, shapes, icons, buttons) by position.
// The screen is 128x64.
import { eventLoop, loadIcon, loadWidget } from "../../lib/modules";
import { back } from "../../lib/router";
import type { Screen } from "../../lib/screen";

// Always subscribe to `view.button` when the widget has button elements:
// pressing one with no subscriber crashed the app (furi_check failed).
function onButton(_sub, event) {
    if (event.type !== "short") return;
    if (event.key === "right") {
        back();
    } else {
        print("widget button:", event.key);
    }
}

function create() {
    // typed `any[]`: with noLib, TS widens the discriminant strings and rejects the literals
    const children: any[] = [
        {
            element: "string",
            x: 64,
            y: 2,
            align: "tm",
            font: "primary",
            text: "Widget",
        },
        { element: "rect", x: 4, y: 16, w: 30, h: 20, radius: 3, fill: false },
        { element: "circle", x: 52, y: 26, radius: 9, fill: true },
        { element: "line", x1: 68, y1: 16, x2: 94, y2: 36 },
        {
            element: "icon",
            x: 104,
            y: 18,
            iconData: loadIcon().getBuiltin("Settings_14"),
        },
        {
            element: "string",
            x: 64,
            y: 40,
            align: "tm",
            font: "secondary",
            text: "string, rect, circle, line, icon",
        },
        { element: "button", button: "left", text: "Left" },
        { element: "button", button: "right", text: "Back" },
    ];
    const view = loadWidget().makeWith({}, children);
    eventLoop.subscribe(view.button, onButton);
    return view;
}

export const widgetDemo: Screen = { title: "Widget (shapes)", create: create };
