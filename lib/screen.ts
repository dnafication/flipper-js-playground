import type { View } from "@flipperdevices/fz-sdk/gui";

/**
 * A screen is one self-contained feature. To add a feature:
 *   1. create screens/<name>.ts exporting a Screen
 *   2. add it to a menu list (index.ts, or screens/components/index.ts)
 *
 * Provide `create` for a lazy screen (the usual case: the view is built the
 * first time the screen opens, which keeps startup RAM low), or `view` for one
 * that is built up front, like a menu.
 */
export type Screen = {
    /** Label shown in the parent menu */
    title: string;
    /** Set by the router after `create()`, or provided directly */
    view?: View<any, any>;
    /** Build the view and subscribe to its events. Called once, on first open */
    create?: () => View<any, any>;
    /** Runs every time the screen is opened, after it is shown */
    onEnter?: () => void;
};
