// Gallery of every GUI view the JS SDK offers. Each file is one demo, and
// dialog.ts is a good template to copy for a new screen.
import { createMenu } from "../../lib/menu";
import { buttonMenuDemo } from "./button_menu";
import { buttonPanelDemo } from "./button_panel";
import { byteInputDemo } from "./byte_input";
import { dialogDemo } from "./dialog";
import { emptyScreenDemo } from "./empty_screen";
import { filePickerDemo } from "./file_picker";
import { iconMenuDemo } from "./icon_menu";
import { iconsDemo } from "./icons";
import { loadingDemo } from "./loading";
import { numberInputDemo } from "./number_input";
import { popupDemo } from "./popup";
import { richButtonsDemo } from "./rich_buttons";
import { submenuDemo } from "./submenu";
import { textBoxDemo } from "./text_box";
import { textInputDemo } from "./text_input";
import { viListDemo } from "./vi_list";
import { widgetDemo } from "./widget";

export const components = createMenu("Components", "Components", [
    // choosing
    dialogDemo,
    submenuDemo,
    buttonMenuDemo,
    buttonPanelDemo,
    richButtonsDemo,
    iconMenuDemo,
    viListDemo,
    // input
    textInputDemo,
    numberInputDemo,
    byteInputDemo,
    filePickerDemo,
    // display
    textBoxDemo,
    widgetDemo,
    iconsDemo,
    popupDemo,
    loadingDemo,
    emptyScreenDemo,
]);
