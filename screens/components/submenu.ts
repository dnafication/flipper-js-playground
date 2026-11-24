import { eventLoop, loadSubmenu } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onChosen(_sub, index, view) {
    view.set("header", "Chose item " + (index + 1).toString());
}

function create() {
    const view = loadSubmenu().makeWith({ header: "Submenu" }, ["One", "Two", "Three"]);
    eventLoop.subscribe(view.chosen, onChosen, view);
    return view;
}

export const submenuDemo: Screen = { title: "Submenu (list)", create: create };
