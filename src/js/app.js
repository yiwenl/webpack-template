import '../scss/global.scss';
import alfrid , { Camera } from 'alfrid';

let GL = alfrid.GL;

window.addEventListener('load', _init);

let camera, bAxis, bDotPlane;

function _init() {
	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	canvas.className = 'Main-Canvas';
	alfrid.GL.init(canvas);

	camera = new alfrid.CameraPerspective();
	camera.setPerspective(Math.PI/2, GL.aspectRatio, 1, 100);
	let ctrl = new alfrid.OrbitalControl(camera, window, 5);

	bAxis = new alfrid.BatchAxis();
	bDotPlane = new alfrid.BatchDotsPlane();

	alfrid.Scheduler.addEF(loop);
}


function loop() {
	GL.clear(0, 0, 0, 0);
	GL.setMatrices(camera);
	bAxis.draw();
	bDotPlane.draw();
}