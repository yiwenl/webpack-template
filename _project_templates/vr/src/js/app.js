import "../scss/global.scss";

import { GL } from "alfrid";
import SceneApp from "./SceneApp";
import preload from "./utils/preload";
import VRUtils from "./VRUtils";

let btnVR;

if (document.body) {
  _init();
} else {
  window.addEventListener("DOMContentLoaded", _init);
}

function _init() {
  VRUtils.checkSupported().then(initButton, noSupport);
  if (!navigator.xr) {
    noSupport();
  }
}

function initButton() {
  const useWebGL2 = true;
  btnVR = document.body.querySelector(".btnVR");
  btnVR.addEventListener("click", () => {
    VRUtils.start(useWebGL2).then(xrStarted, logError);
  });
}

function xrStarted({ canvas, gl }) {
  console.log("XR started", canvas, gl);
  // GL.initWithGL(gl);
  // const scene = new SceneApp();

  preload(gl).then(() => {
    const scene = new SceneApp();
  }, logError);
}

function logError(e) {
  console.log("Error", e);
  noSupport();
}

function noSupport() {
  document.body.classList.add("no-xr");

  preload().then(() => {
    const scene = new SceneApp();
  }, logError);
}
