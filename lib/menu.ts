import { eventLoop, loadSubmenu } from "./modules";
import { open } from "./router";
import type { Screen } from "./screen";

// `screens` travels as an extra subscribe argument because mJS has no closures,
// which also lets every menu share this one callback.
function onChosen(_sub, index, screens) {
    open(screens[index]);
}

/** A menu is itself a Screen, so menus nest: put one in another menu's list */
export function createMenu(title: string, header: string, screens: Screen[]): Screen {
    const titles: string[] = [];
    for (let i = 0; i < screens.length; i++) {
        titles[i] = screens[i].title;
    }
    const view = loadSubmenu().makeWith({ header: header }, titles);
    eventLoop.subscribe(view.chosen, onChosen, screens);
    return { title: title, view: view };
}
