import EventDispatcher from "events";

class VRUtils extends EventDispatcher {
  constructor() {
    super();
    this._isSupported = false;
    this._hasChecked = false;
  }

  checkSupported() {
    return new Promise((resolve, reject) => {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        this._isSupported = supported;
        this._hasChecked = true;
        if (supported) {
          // xrButton.innerHTML = 'Enter AR';
          console.log("supported AR");
          resolve("supported AR");
        } else {
          // xrButton.innerHTML = 'AR not found';
          console.log("AR not suppoerted");
          reject(new Error("AR not suppoerted"));
        }
      });
    });
  }

  start(mWebgl2 = false) {
    const contextTarget = mWebgl2 ? "webgl2" : "webgl";
    console.log("contextTarget", contextTarget);
    return new Promise((resolve, reject) => {
      navigator.xr.requestSession("immersive-vr").then((session) => {
        this.session = session;
        this.canvas = document.createElement("canvas");
        this._gl = this.canvas.getContext(contextTarget, {
          xrCompatible: true,
        });

        this.session.updateRenderState({
          baseLayer: new XRWebGLLayer(this.session, this._gl),
        });

        this.session.requestReferenceSpace("local").then((refSpace) => {
          this._xrRefSpace = refSpace;

          // Inform the session that we're ready to begin drawing.
          session.requestAnimationFrame((t, frame) =>
            this._onXRFrame(t, frame)
          );
          resolve({
            canvas: this.canvas,
            gl: this._gl,
          });
        });
      });
    });
  }

  _onXRFrame(t, frame) {
    const { _gl: gl } = this;
    const session = frame.session;
    const pose = frame.getViewerPose(this._xrRefSpace);

    if (!pose) {
      this.session.requestAnimationFrame((t, frame) =>
        this._onXRFrame(t, frame)
      );
      return;
    }

    const glLayer = session.renderState.baseLayer;
    const views = [];
    for (let view of pose.views) {
      const viewport = glLayer.getViewport(view);
      const projectionMatrix = view.projectionMatrix;
      const viewMatrix = view.transform.inverse.matrix;
      views.push({
        viewMatrix,
        projectionMatrix,
        viewport,
      });
    }

    this.emit("onUpdate", views);
    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);
    this.emit("onRender", views);
    this.session.requestAnimationFrame((t, frame) => this._onXRFrame(t, frame));
  }

  get isSupported() {
    return this._isSupported;
  }
}

export default new VRUtils();
