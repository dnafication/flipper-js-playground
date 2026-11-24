import { loadEmptyScreen } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function create() {
    return loadEmptyScreen().make();
}

export const emptyScreenDemo: Screen = { title: "Empty screen", create: create };
