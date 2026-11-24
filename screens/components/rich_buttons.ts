// Demo of the rich button grid (lib/button_grid.ts): hover, pressed, click and
// long-press. Only 7 built-in icons exist, so "pressed" borrows the hover icon
// of the opposite pair (power <-> off). Custom icons would give real pressed art.

import type { ButtonGrid, RichButton } from "../../lib/button_grid";
import { createButtonGrid } from "../../lib/button_grid";
import { loadIcon } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

let clicks = 0;

function onClick(grid: ButtonGrid, _index: number) {
    clicks = clicks + 1;
    grid.detail = "clicks " + clicks.toString();
}

function onLongPress(grid: ButtonGrid, _index: number) {
    clicks = 0;
    grid.detail = "reset";
}

function create() {
    const icon = loadIcon();
    const power = icon.getBuiltin("power_19x20");
    const powerHover = icon.getBuiltin("power_hover_19x20");
    const off = icon.getBuiltin("off_19x20");
    const offHover = icon.getBuiltin("off_hover_19x20");

    const buttons: RichButton[] = [
        {
            name: "Power",
            icon: power,
            hover: powerHover,
            pressed: offHover,
            onClick: onClick,
            onLongPress: onLongPress,
        },
        { name: "Off", icon: off, hover: offHover, pressed: powerHover, onClick: onClick, onLongPress: onLongPress },
        {
            name: "Power",
            icon: power,
            hover: powerHover,
            pressed: offHover,
            onClick: onClick,
            onLongPress: onLongPress,
        },
        { name: "Off", icon: off, hover: offHover, pressed: powerHover, onClick: onClick, onLongPress: onLongPress },
        {
            name: "Power",
            icon: power,
            hover: powerHover,
            pressed: offHover,
            onClick: onClick,
            onLongPress: onLongPress,
        },
        { name: "Off", icon: off, hover: offHover, pressed: powerHover, onClick: onClick, onLongPress: onLongPress },
    ];
    return createButtonGrid(buttons, 3).view;
}

export const richButtonsDemo: Screen = { title: "Rich buttons", create: create };
