import EventDispatcher from "events";

import VRUtils from "./VRUtils";
import Scheduler from "scheduling";

export const controllerName = (hand, profiles) =>
  hand + ":" + profiles.join("|");

class VRControls extends EventDispatcher {
  constructor() {
    super();

    this.controllers = {};

    Scheduler.addEF(() => this._loop());
  }

  _loop() {
    const { session } = VRUtils;
    // session not ready
    if (!session) {
      return;
    }

    const toLog = Math.random() > 0.95;

    session.inputSources.forEach((inputSource, s) => {
      const { gamepad, handedness: hand, profiles } = inputSource;

      const controller =
        this.controllers[hand] ||
        (this.controllers[hand] = {
          hand,
          profiles,
          id: s,
          inputSource,
          buttons: [],
          axes: [],
        });

      if (toLog) {
        console.log(controller, this.controllers);
      }
    });
  }
}

export default new VRControls();
