import EventDispatcher from "events";

class VRUtils extends EventDispatcher {
  constructor() {
    super();
    this._isSupported = false;
    this._hasChecked = false;
    this.useLocalFloor = true;
  }

  checkSupported() {
    return new Promise((resolve, reject) => {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        this._isSupported = supported;
        this._hasChecked = true;
        if (supported) {
          // xrButton.innerHTML = 'Enter VR';
          console.log("supported VR");
          resolve("supported VR");
        } else {
          // xrButton.innerHTML = 'VR not found';
          console.log("VR not suppoerted");
          reject(new Error("VR not suppoerted"));
        }
      });
    });
  }

  start(mWebgl2 = false) {
    const contextTarget = mWebgl2 ? "webgl2" : "webgl";
    return new Promise((resolve, reject) => {
      navigator.xr
        .requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"],
          optionalFeatures: ["bounded-floor"],
        })
        .then((session) => {
          this.session = session;
          this.canvas = document.createElement("canvas");
          this._gl = this.canvas.getContext(contextTarget, {
            xrCompatible: true,
          });

          this.session.updateRenderState({
            baseLayer: new XRWebGLLayer(this.session, this._gl),
          });

          const refSpace = this.useLocalFloor ? "local-floor" : "local";
          this.session.requestReferenceSpace(refSpace).then((refSpace) => {
            this._xrRefSpace = refSpace;

            // Inform the session that we're ready to begin drawing.
            session.requestAnimationFrame((t, frame) =>
              this._onXRFrame(t, frame)
            );
            resolve({
              session,
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
