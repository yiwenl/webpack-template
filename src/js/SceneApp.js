// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bSky = new alfrid.BatchSkybox();
	}


	render() {
		this.orbitalControl.ry.value += 0.01;
		GL.clear(0, 0, 0, 0);

		this._bSky.draw(Assets.get('studio_radiance'));
		// this._bSky.draw(Assets.get('studio_irradiance'));

		this._bAxis.draw();
		this._bDots.draw();


		const size = 200;
		GL.viewport(0, 0, size, size);
		this._bCopy.draw(Assets.get('noise'));

	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;