// SceneApp.js

import alfrid , { Scene } from 'alfrid';

const GL = alfrid.GL;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
	}

	_initTextures() {

	}


	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		this._bAxis.draw();
		this._bDots.draw();

	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;