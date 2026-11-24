import { createMenu } from "./lib/menu";
import { run } from "./lib/router";
import { about } from "./screens/about";
import { components } from "./screens/components";

// Register features here. Order is the order shown in the main menu.
run(createMenu("JS Playground", "JS Playground", [components, about]));
