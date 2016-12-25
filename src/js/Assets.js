// Assets.js

import assetsToLoad from './asset-list';
import alfrid, { GLTexture, GLCubeTexture, Mesh, ObjLoader } from 'alfrid';

const Assets = {};
let _assets = [];

const getAsset = function(id) {
	return assets.find( (a) => a.id === id).file;
}

const getExtension = function(mFile) {
	const ary = mFile.split('.');
	return ary[ary.length - 1];
}

Assets.init = function() {

	_assets = assetsToLoad.map((o)=> {
		const ext = getExtension(o.url);
		const file = getAsset(o.id);
		let texture;

		switch(ext) {
			case 'jpg':
			case 'png':
				texture = new GLTexture(file);
				return {
					id:o.id,
					file:texture
				};
				break;

			case 'dds':
				texture = GLCubeTexture.parseDDS(file);
				return {
					id:o.id,
					file:texture
				};
				break;

			case 'obj':
				const mesh = ObjLoader.parse(file);
				return {
					id:o.id,
					file:mesh
				}
				break;
		}

	});

	console.debug('ASSETS:');
	console.table(_assets);
}

Assets.get = function(mId) {
	return _assets.find((a) => {
		return a.id === mId;
	}).file;
}

export default Assets;