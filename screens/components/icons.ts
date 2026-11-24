// Every built-in firmware icon the SDK can fetch with getBuiltin().
import { loadIcon, loadWidget } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function create() {
    const icon = loadIcon();
    // typed `any[]`: with noLib, TS widens the discriminant strings and rejects the literals
    const children: any[] = [
        { element: "icon", x: 2, y: 2, iconData: icon.getBuiltin("power_19x20") },
        { element: "icon", x: 24, y: 2, iconData: icon.getBuiltin("power_hover_19x20") },
        { element: "icon", x: 46, y: 2, iconData: icon.getBuiltin("Settings_14") },
        { element: "icon", x: 2, y: 26, iconData: icon.getBuiltin("off_19x20") },
        { element: "icon", x: 24, y: 26, iconData: icon.getBuiltin("off_hover_19x20") },
        { element: "icon", x: 46, y: 26, iconData: icon.getBuiltin("js_script_10px") },
        { element: "icon", x: 68, y: 5, iconData: icon.getBuiltin("DolphinWait_59x54") },
    ];
    return loadWidget().makeWith({}, children);
}

export const iconsDemo: Screen = { title: "Icons", create: create };
