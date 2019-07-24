// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import Assets from './Assets';
import Config from './Config';
import { resize } from './utils';


class SceneApp extends Scene {
	constructor() {

		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;

		this.resize();
	}


	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._vModel = new ViewObjModel();
	}


	render() {
		GL.clear(0, 0, 0, 0);

		this._bAxis.draw();
		this._bDots.draw();

		this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));
	}

	resize(w, h) {
		resize(w, h);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;