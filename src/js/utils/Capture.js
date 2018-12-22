// Capture.js


import { GL } from 'alfrid';
import { saveImage } from './';

const options = {
	day: 'numeric', 
	year: 'numeric', 
	month: 'numeric', 
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const capture = () => {
	window.addEventListener('keydown', (e) => {
		if(e.keyCode === 83 && e.metaKey) {
			e.preventDefault();
			let strDate = new Date().toLocaleDateString("en-US", options);
			strDate = strDate.replace(', ', '_');
			strDate = strDate.replace('AM', '');
			strDate = strDate.replace('PM', '');
			strDate = strDate.replaceAll('/', '.');
			strDate = strDate.replaceAll(':', '.');

			saveImage(GL.canvas, strDate);
		}
	});
}


export default capture();