// addControls.js

import Settings from "../Settings";
import Config from "../Config";
import { saveJson } from "../utils";
import { GL } from "alfrid";

const addControls = (scene) => {
  const oControl = {
    save: () => {
      saveJson(Config, "Settings");
    },
    webgl2: GL.webgl2.toString(),
  };

  setTimeout(() => {
    // gui.add(oControl, "webgl2").listen();
    gui.add(oControl, "save").name("Save Settings");
    gui.add(Settings, "reset").name("Reset Default");
  }, 200);
};

export default addControls;
