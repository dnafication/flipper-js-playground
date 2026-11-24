import { eventLoop, loadPopup } from "../../lib/modules";
import { back } from "../../lib/router";
import type { Screen } from "../../lib/screen";

function onTimeout() {
    back();
}

function create() {
    const view = loadPopup().makeWith({
        header: "Popup",
        text: "Closes by itself",
        timeout: 3000,
    });
    eventLoop.subscribe(view.timeout, onTimeout);
    return view;
}

export const popupDemo: Screen = { title: "Popup (timed)", create: create };
