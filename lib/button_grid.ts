// Reusable grid of "rich" buttons built on the button panel view.
//
// Each button has three looks: normal, hover (firmware draws it when the
// button has focus) and pressed (we draw it: on a `press` event we rebuild the
// children with the pressed icon, and on `release`/`short` we restore them).
// A status column on the right shows the last button and event.
//
// mJS has no closures, so all state lives on the `ButtonGrid` object, which is
// passed to the event callback as an extra subscribe argument.
import type { IconData } from "@flipperdevices/fz-sdk/gui/icon";
import { eventLoop, loadButtonPanel } from "./modules";

export type RichButton = {
    /** Short name shown in the status column (about 7 characters fit) */
    name: string;
    icon: IconData;
    hover: IconData;
    pressed: IconData;
    onPress?: (grid: ButtonGrid, index: number) => void;
    onRelease?: (grid: ButtonGrid, index: number) => void;
    /** A complete press and release */
    onClick?: (grid: ButtonGrid, index: number) => void;
    onLongPress?: (grid: ButtonGrid, index: number) => void;
};

export type ButtonGrid = {
    view: any;
    buttons: RichButton[];
    columns: number;
    /** Index of the button currently held down, or -1 */
    pressed: number;
    /** Last event type, shown in the status column */
    event: string;
    /** Free text for the third status line. Handlers can set it */
    detail: string;
};

const CELL_W = 28;
const CELL_H = 26;
const ORIGIN_X = 4;
const ORIGIN_Y = 4;
const STATUS_X = 4 + 3 * CELL_W + 4;

function draw(grid: ButtonGrid): void {
    // typed `any[]`: with noLib, TS widens the discriminant strings and rejects the literals
    const children: any[] = [];
    let col = 0;
    let row = 0;
    for (let i = 0; i < grid.buttons.length; i++) {
        const b = grid.buttons[i];
        const down = i === grid.pressed;
        children[i] = {
            type: "button",
            matrixX: col,
            matrixY: row,
            x: ORIGIN_X + col * CELL_W,
            y: ORIGIN_Y + row * CELL_H,
            icon: down ? b.pressed : b.icon,
            // while held, keep the pressed look even though the button is focused
            iconSelected: down ? b.pressed : b.hover,
        };
        col = col + 1;
        if (col >= grid.columns) {
            col = 0;
            row = row + 1;
        }
    }
    const shown = grid.pressed >= 0 ? grid.buttons[grid.pressed].name : "-";
    const n = grid.buttons.length;
    children[n] = { type: "label", x: STATUS_X, y: 16, font: "secondary", text: shown };
    children[n + 1] = { type: "label", x: STATUS_X, y: 30, font: "secondary", text: grid.event };
    children[n + 2] = { type: "label", x: STATUS_X, y: 44, font: "secondary", text: grid.detail };
    grid.view.setChildren(children);
}

function onInput(_sub, event, grid) {
    print("button grid:", event.type, "index", event.index);
    const button = grid.buttons[event.index];
    if (!button) return;
    grid.event = event.type;
    if (event.type === "press") {
        grid.pressed = event.index;
        if (button.onPress) button.onPress(grid, event.index);
    } else if (event.type === "release") {
        grid.pressed = -1;
        if (button.onRelease) button.onRelease(grid, event.index);
    } else if (event.type === "short") {
        grid.pressed = -1;
        if (button.onClick) button.onClick(grid, event.index);
    } else if (event.type === "long") {
        if (button.onLongPress) button.onLongPress(grid, event.index);
    }
    draw(grid);
}

/** Build the grid view. Show `grid.view` (e.g. return it from a screen's `create`) */
export function createButtonGrid(buttons: RichButton[], columns: number): ButtonGrid {
    let rows = 0;
    for (let left = buttons.length; left > 0; left = left - columns) {
        rows = rows + 1;
    }
    const grid: ButtonGrid = {
        view: loadButtonPanel().makeWith({ matrixSizeX: columns, matrixSizeY: rows }),
        buttons: buttons,
        columns: columns,
        pressed: -1,
        event: "ready",
        detail: "",
    };
    draw(grid);
    eventLoop.subscribe(grid.view.input, onInput, grid);
    return grid;
}
