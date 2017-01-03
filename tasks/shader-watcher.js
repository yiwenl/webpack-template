// shader-watcher.js

'use strict';

const fs         = require('fs');
const findFolder = require('./find-folder');
let shaderPath;


findFolder('./src', 'shaders', (mPath)=> {
	shaderPath = mPath;
	console.log('Shader Path :', shaderPath);
});