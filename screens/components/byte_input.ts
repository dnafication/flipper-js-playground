import { eventLoop, loadByteInput } from "../../lib/modules";
import type { Screen } from "../../lib/screen";

function onInput(_sub, data, view) {
    view.set("header", "Got: " + data);
}

function create() {
    const view = loadByteInput().makeWith({
        header: "Byte input",
        length: 4,
        defaultData: Uint8Array([0xde, 0xad, 0xbe, 0xef]),
    });
    eventLoop.subscribe(view.input, onInput, view);
    return view;
}

export const byteInputDemo: Screen = { title: "Byte (hex) input", create: create };
