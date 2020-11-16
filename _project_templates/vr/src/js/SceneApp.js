// SceneApp.js

import alfrid, { GL } from "alfrid";
import VRUtils from "./VRUtils";
import { mat4 } from "gl-matrix";

class SceneApp {
  constructor() {
    GL.enableAlphaBlending();

    this.camera = new alfrid.CameraPerspective();
    this._initTextures();
    this._initViews();

    this.mtx = mat4.create();
    mat4.translate(this.mtx, this.mtx, [0, 0, -1]);

    console.log("FLOAT", GL.FLOAT, GL.gl);

    // events

    VRUtils.on("onUpdate", (views) => this.update(views));
    VRUtils.on("onRender", (views) => this.render(views));
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
}

export default SceneApp;
