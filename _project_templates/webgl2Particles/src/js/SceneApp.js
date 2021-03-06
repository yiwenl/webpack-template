// SceneApp.js

import alfrid, { Scene, GL } from "alfrid";
import Assets from "./Assets";
import Config from "./Config";
import { resize, biasMatrix } from "./utils";

import debugCamera from "./utils/debugCamera";
import getParticleTexture from "./utils/getParticleTexture";

import DrawSave from "./DrawSave";

import vsPass from "shaders/pass.vert";
import fsSim from "shaders/sim.frag";

import vsRender from "shaders/render.vert";
import fsRender from "shaders/render.frag";
import fsDepth from "shaders/depth.frag";

class SceneApp extends Scene {
  constructor() {
    super();
    window.GL = GL;
    GL.enableAlphaBlending();
    this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
    this.orbitalControl.radius.value = 10;
    this._seed = Math.random() * 0xff;

    this._lightPos = [0, 4, 1];
    this._cameraLight = new alfrid.CameraOrtho();
    const s = 3.5;
    this._cameraLight.ortho(-s, s, s, -s, 0.5, 7.5);
    this._cameraLight.lookAt(this._lightPos, [0, 0, 0]);

    this._mtxShadow = mat4.create();
    mat4.mul(
      this._mtxShadow,
      this._cameraLight.projection,
      this._cameraLight.matrix
    );
    mat4.mul(this._mtxShadow, biasMatrix, this._mtxShadow);

    this._textureParticle = getParticleTexture(this._lightPos);

    gui.add(GL, "webgl2");

    this.resize();
  }

  _initTextures() {
    const { numSets, numParticles } = Config;
    console.log("init textures", numSets, numParticles);

    this._sets = [];
    const o = {
      type: GL.FLOAT,
      minFilter: GL.NEAREST,
      magFilter: GL.NEAREST,
    };

    for (let i = 0; i < numSets; i++) {
      const fbo = new alfrid.FboPingPong(numParticles, numParticles, o, 4);
      this._sets.push(fbo);
    }

    const shadowMapSize = 2048;
    this._fboDepth = new alfrid.FrameBuffer(shadowMapSize, shadowMapSize);
  }

  _initViews() {
    const { numParticles } = Config;
    console.log("init views");

    this._bCopy = new alfrid.BatchCopy();
    this._bAxis = new alfrid.BatchAxis();
    this._bDots = new alfrid.BatchDotsPlane();
    this._bBall = new alfrid.BatchBall();

    this._sets.forEach((fbo) => {
      new DrawSave()
        .setClearColor(0, 0, 0, 1)
        .bindFrameBuffer(fbo.read)
        .draw()
        .bindFrameBuffer(fbo.write)
        .draw();
    });

    const meshRender = (() => {
      const mesh = new alfrid.Mesh(GL.POINTS);
      const positions = [];
      const indices = [];
      let index = 0;

      for (let i = 0; i < numParticles; i++) {
        for (let j = 0; j < numParticles; j++) {
          positions.push([i / numParticles, j / numParticles, 0]);
          indices.push(index);
          index++;
        }
      }

      mesh.bufferVertex(positions).bufferIndex(indices);

      return mesh;
    })();

    this._drawRender = new alfrid.Draw()
      .setMesh(meshRender)
      .useProgram(vsRender, fsRender);

    this._drawDepth = new alfrid.Draw()
      .setMesh(meshRender)
      .useProgram(vsRender, fsDepth);

    this._drawSim = new alfrid.Draw()
      .setMesh(alfrid.Geom.bigTriangle())
      .useProgram(vsPass, fsSim)
      .setClearColor(0, 0, 0, 1);
  }

  update() {
    if (Config.pause) {
      return;
    }
    this._sets.forEach((fbo) => {
      this._drawSim
        .bindFrameBuffer(fbo.write)
        .uniformTexture("texturePos", fbo.read.getTexture(0), 0)
        .uniformTexture("textureVel", fbo.read.getTexture(1), 1)
        .uniformTexture("textureExtra", fbo.read.getTexture(2), 2)
        .uniform("uTime", "float", alfrid.Scheduler.deltaTime + this._seed)
        .draw();

      fbo.swap();
    });

    GL.setMatrices(this._cameraLight);
    this._fboDepth.bind();
    GL.clear(1, 0, 0, 1);
    this._sets.forEach((fbo) => {
      this._drawDepth
        .uniformTexture("texturePos", fbo.read.getTexture(0), 0)
        .uniformTexture("textureExtra", fbo.read.getTexture(2), 1)
        .uniform("uViewport", "vec2", [GL.width, GL.height])
        .uniform("uShadowMatrix", "mat4", this._mtxShadow)
        .draw();
    });
    this._fboDepth.unbind();
  }

  render() {
    GL.clear(0, 0, 0, 1);
    GL.setMatrices(this.camera);

    if (Config.debug) {
      this._bAxis.draw();
      this._bDots.draw();
    }

    this._sets.forEach((fbo) => {
      this._drawRender
        .uniformTexture("texturePos", fbo.read.getTexture(0), 0)
        .uniformTexture("textureExtra", fbo.read.getTexture(2), 1)
        .uniformTexture("textureDepth", this._fboDepth.depthTexture, 2)
        .uniformTexture("textureParticle", this._textureParticle, 3)
        .uniform("uViewport", "vec2", [GL.width, GL.height])
        .uniform("uShadowMatrix", "mat4", this._mtxShadow)
        .draw();
    });

    if (Config.debug) {
      debugCamera(this._cameraLight);
    }
  }

  resize(w, h) {
    resize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
