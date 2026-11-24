import { eventLoop, loadIcon, loadIconMenu } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onChosen(_sub, index) {
    print("icon menu: chose", index);
}

function create() {
    const icon = loadIcon();
    const view = loadIconMenu().makeWith({}, [
        { icon: icon.getBuiltin("Settings_14"), label: "Settings" },
        { icon: icon.getBuiltin("js_script_10px"), label: "Script" },
        { icon: icon.getBuiltin("power_19x20"), label: "Power" },
    ]);
    eventLoop.subscribe(view.chosen, onChosen);
    return view;
}

export const iconMenuDemo: Screen = { title: "Icon menu", create: create };
