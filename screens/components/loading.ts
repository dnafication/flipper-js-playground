// The loading view swallows the back key, so the screen must leave on its own.
import { eventLoop, loadLoading } from "../../lib/modules";
import { back } from "../../lib/router";
import type { Screen } from "../../lib/screen";

function onDone() {
    back();
}

function create() {
    return loadLoading().make();
}

// a fresh one-shot timer each time the screen opens
function onEnter() {
    eventLoop.subscribe(eventLoop.timer("oneshot", 2000), onDone);
}

export const loadingDemo: Screen = { title: "Loading (2s)", create: create, onEnter: onEnter };
