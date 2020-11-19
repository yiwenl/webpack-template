// SceneApp.js

import alfrid, { GL } from "alfrid";
import VRUtils from "./VRUtils";
import { resize } from "./utils";
import { mat4 } from "gl-matrix";

class SceneApp {
  constructor() {
    GL.enableAlphaBlending();
    window.GL = GL;

    this.camera = new alfrid.CameraPerspective();
    this._initTextures();
    this._initViews();

    this.mtx = mat4.create();
    mat4.translate(this.mtx, this.mtx, [0, 0, -1]);

    // events

    console.log("VR supported :", VRUtils.isSupported);

    if (VRUtils.isSupported) {
      VRUtils.on("onUpdate", (views) => this.update(views));
      VRUtils.on("onRender", (views) => this.render(views));
    } else {
      this.camera = new alfrid.CameraPerspective();
      const RAD = Math.PI / 180;
      this.camera.setPerspective(65 * RAD, GL.aspectRatio, 0.1, 100);
      this.orbitalControl = new alfrid.OrbitalControl(this.camera, window, 5);

      alfrid.Scheduler.addEF(() => this._loop());
      window.addEventListener("resize", () => this.resize());
    }
  }

  _initTextures() {
    console.log("init textures");
  }

  _initViews() {
    console.log("init views");

    this._bCopy = new alfrid.BatchCopy();
    this._bAxis = new alfrid.BatchAxis();
    this._bDots = new alfrid.BatchDotsPlane();
    this._bBall = new alfrid.BatchBall();
  }

  _loop() {
    this.update();

    GL.clear(0, 0, 0, 0);

    GL.setMatrices(this.camera);
    this._renderScene();
  }

  update() {
    // console.log("update");
  }

  render(views) {
    GL.clear(0, 0, 0, 1);
    views.forEach(({ viewport, viewMatrix, projectionMatrix }) => {
      GL.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      mat4.copy(this.camera._projection, projectionMatrix);
      mat4.copy(this.camera._matrix, viewMatrix);
      GL.setMatrices(this.camera);
      this._renderScene();
    });
  }

  _renderScene() {
    GL.rotate(this.mtx);
    this._bAxis.draw();
    this._bDots.draw();

    const s = 0.1;
    this._bBall.draw([0, 0, 0], [s, s, s], [1, 1, 0]);

    GL.rotate(mat4.create());
  }

  resize() {
    resize();
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
