// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vScreenPosition;

#pragma glslify: rotate    = require(glsl-utils/rotate.glsl)
#define PI 3.141592653

void main(void) {

    float radius = mix(0.1, 0.2, aExtra.x);
    float y = (aVertexPosition.y + 0.5) * 15.0;

    vec3 pos = vec3(radius, y, 0);

    float ry = aVertexPosition.x + 0.5;
    pos.xz = rotate(pos.xz, -ry * PI * 2.0);

    float a = 0.05;
    pos.xy = rotate(pos.xy, mix(-a, a, aExtra.y));
    pos.yz = rotate(pos.yz, mix(-a, a, aExtra.y));


    // offsetting with instance
    pos.xz += aPosOffset.xz;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    vPosition = pos;
    vScreenPosition = gl_Position.xyz /gl_Position.w;
}