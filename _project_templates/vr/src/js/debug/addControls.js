// addControls.js

import Settings from "../Settings";
import Config from "../Config";
import { saveJson } from "../utils";

const addControls = (scene) => {
  const oControl = {
    save: () => {
      saveJson(Config, "Settings");
    },
  };

  setTimeout(() => {
    gui.add(oControl, "save").name("Save Settings");
    gui.add(Settings, "reset").name("Reset Default");
  }, 200);
};

export default addControls;
