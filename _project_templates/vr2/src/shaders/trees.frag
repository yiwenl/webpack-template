precision highp float;

uniform float uEnvSize;
varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec3 vScreenPosition;

void main(void) {

    float distToCenter = length(vPosition);
    float g = clamp(distToCenter / uEnvSize, 0.0, 1.0);
    // g = 1.0 - g;
    g = smoothstep(0.2, 0.8, g);
    // g = pow(g, 3.0);

    gl_FragColor = vec4(vec3(g), 1.0);
}