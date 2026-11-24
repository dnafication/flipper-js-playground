import { loadTextBox } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

// No event subscription here: the SDK typings declare `view.chosen`, but on a
// real device it does not exist and subscribing to it crashes ("expected pointer").
function create() {
    return loadTextBox().makeWith({
        text: "Text box\nScrollable multi-line text.\nUse up and down\nto scroll.\n\nLine 6\nLine 7\nLine 8\nLine 9\nThe end",
        font: "text",
        focus: "start",
    });
}

export const textBoxDemo: Screen = { title: "Text box (scroll)", create: create };
