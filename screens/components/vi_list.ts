import { eventLoop, loadViList } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onUpdate(_sub, update) {
    print("vi list: item", update.itemIndex, "value", update.valueIndex);
}

function create() {
    const view = loadViList().makeWith({}, [
        { label: "Speed", variants: ["Slow", "Medium", "Fast"] },
        { label: "Mode", variants: ["A", "B"] },
        { label: "Level", variants: ["1", "2", "3", "4"] },
    ]);
    eventLoop.subscribe(view.valueUpdate, onUpdate);
    return view;
}

export const viListDemo: Screen = { title: "Option list", create: create };
