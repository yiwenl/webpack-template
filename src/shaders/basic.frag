// basic.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;

void main(void) {
    gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
}