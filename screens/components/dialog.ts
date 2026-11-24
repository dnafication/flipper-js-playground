import { eventLoop, loadDialog } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

// Extra args arrive after (subscription, item): here, the view itself.
function onInput(_sub, button, view) {
    view.set("text", "Pressed: " + button);
}

function create() {
    const view = loadDialog().makeWith({
        header: "Dialog",
        text: "Press a button",
        left: "Left",
        center: "Center",
        right: "Right",
    });
    eventLoop.subscribe(view.input, onInput, view);
    return view;
}

export const dialogDemo: Screen = { title: "Dialog", create: create };
