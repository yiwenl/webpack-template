// SceneApp.js

import alfrid, { Scene } from 'alfrid';
import ViewObjModel from './ViewObjModel';

window.getAsset = function (id) {
	for(var i = 0; i < assets.length; i++) {
		if(id === assets[i].id) {
			return assets[i].file;
		}
	}
};

const GL = alfrid.GL;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
	}

	_initTextures() {
		this._textureIrr = alfrid.GLCubeTexture.parseDDS(getAsset('irradiance'));
		this._textureRad = alfrid.GLCubeTexture.parseDDS(getAsset('radiance'));

		this._textureAO = new alfrid.GLTexture(getAsset('aomap'));
	}


	_initViews() {
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();
		this._bSkybox = new alfrid.BatchSkybox();
		this._vModel = new ViewObjModel();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		// this._bSkybox.draw(this._textureRad);
		this._bAxis.draw();
		this._bDots.draw();

		this._vModel.render(this._textureRad, this._textureIrr, this._textureAO);
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;