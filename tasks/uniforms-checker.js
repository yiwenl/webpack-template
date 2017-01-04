// uniforms-checker.js

'use strict';

const fs             = require('fs');
const path           = require('path');
const findFolder     = require('./find-folder');
const watcher        = require('./watch');
const getAllMatches  = require('./getAllMatches');
const insertString   = require('./insertString');
const checkExtension   = require('./checkExtension');

const PATH_SRC       = './src';
const regShader      = /shaders\/.+\.(vert|frag)/g;
const regUniform     = /shader\.uniform\(.*/g;
const regUniformGLSL = /uniform\s.+/g;
const regUniformLast = /uniform\s.+;/g;


let shaderPath;

findFolder(PATH_SRC, 'shaders', (mPath)=> {
	shaderPath = mPath;
	startWatch();
});

let watcherViews = watcher([PATH_SRC]);

function startWatch() {
	// onFileChange('./src/js/views/ViewTest.js');

	watcherViews.on('all',(event, file) => {
		if(file.indexOf('.DS_Store') > -1) return;
		if(!checkExtension(file, ['js'])) return;
		if(event !== 'add' && event !== 'change') return;
		onFileChange(file);
	});
}


function replace(str, pattern, strToReplace)  {
	return str.replace(new RegExp(pattern, 'g'), strToReplace);	
}

function onFileChange(mPath) {
	console.log('File Changed :', mPath);
	let results;

	parseJS(mPath, (results) => {
		console.log('Results:', results);

		if(results.shaders.length == 0) return;

		let count = 0;

		let uniforms = [];

		const combineUniforms = ()=> {
			let final = [];

			uniforms.forEach((u)=> {
				if(final.length == 0) {
					final.push(u);
				} else {
					let result = final.filter((a)=> {
						return a.uniformName === u.uniformName;
					});

					if(result.length == 0) {
						final.push(u);
					}
				}
			});
			
			const uniformsToAdd = [];
			results.uniforms.forEach((uniform)=> {
				let match = final.find((u)=> {
					return u.uniformName === uniform.uniformName;
				});

				if(!match) { uniformsToAdd.push(uniform); }
			});

			
			if(uniformsToAdd.length == 0) { return; }
			results.shaders.forEach((shader)=> {
				addUniforms(shader, uniformsToAdd);	
			});
		}

		const onParsed = (oUniforms) => {
			uniforms = uniforms.concat(oUniforms);
			count ++;
			if(count == results.shaders.length) {
				combineUniforms();
			}
		}

		results.shaders.forEach((mShaderPath)=> {
			// checkUniforms(mShaderPath, results.uniforms);
			getShaderUniforms(mShaderPath, onParsed);
		})
	});
}


function parseJS(mPath, mCallback) {
	let shaders = [];
	fs.readFile(mPath, 'utf8', (err, str) => {
		if(err) {
			console.log('Error Loading file !');
		} else {
			shaders = getAllMatches(str, regShader);

			shaders = shaders.map((path)=> {
				return path.replace('shaders/', '');
			});


			getUniforms(str, (uniforms)=> {
				const o = {
					shaders,
					uniforms,
				}
				mCallback(o);
			});
		}
	});
}

function getUniforms(mFile, mCb) {
	let uniforms = getAllMatches(mFile, regUniform);

	uniforms = uniforms.map((u) => {
		let s = replace(u, '"', "");
		s = replace(s, "'");
		s = s.split('(')[1];
		s = s.split(')')[0];
		const ary = s.split(', ');
		const uniformName = ary[0];
		const uniformType = ary[1];

		return {
			uniformName,
			uniformType
		};
	});

	mCb(uniforms);
}

function readShader(mPath, mCallback) {

}

function getShaderUniforms(mShaderPath, mCb) {
	fs.readFile(path.resolve(shaderPath, mShaderPath), 'utf8', (err, str) => {
		if(err) {
			console.log('Error Loading file !');
		} else {
			let uniformsGlsl = getAllMatches(str, regUniformGLSL);

			uniformsGlsl = uniformsGlsl.map((u)=> {
				const s = u.replace(';', '');
				const tmp = s.split(' ');
				const uniformType = tmp[1];
				const uniformName = tmp[2];
				return {
					uniformName,
					uniformType
				};
			});

			mCb(uniformsGlsl);
		}
	});

}

function addUniforms(mPath, mUniformsToAdd) {
	console.log('Add uniform :', mPath, mUniformsToAdd);
	const targetShaderPath = path.resolve(shaderPath, mPath);

	fs.readFile(targetShaderPath, 'utf8', (err, str) => {
		if(err) {
			console.log('Error Loading file !');
		} else {
			const uniformsGlsl = getAllMatches(str, regUniformLast, true);
			const temp = uniformsGlsl.pop();
			const index = temp.index + temp[0].length;

			let strUniform = '\n';
			mUniformsToAdd.forEach((uniform)=> {
				strUniform += `uniform ${uniform.uniformType} ${uniform.uniformName};\n`;
			});

			str = insertString(str, strUniform, index);

			fs.writeFile(targetShaderPath, str, (err, data) => {
				if(err)  {
					console.log('Error Writing File');
				} else {
					console.log(`shader ${mPath} updated`);	
				}
			});
		}
	});
}

function writeShader() {

}
