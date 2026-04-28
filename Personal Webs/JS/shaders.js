export const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float waveA = sin((uv.y * 12.0) + (uTime * 1.3)) * 0.03;
  float waveB = cos((uv.x * 10.0) - (uTime * 1.1)) * 0.02;
  uv.x += (waveA + waveB) * uProgress;

  vec4 tex = texture2D(uTexture, uv);
  gl_FragColor = tex;
}
`;
