precision mediump float;
attribute vec3 position;
uniform mat4 modelViewMatrix, projectionMatrix;
varying vec3 vWorldPos;
void main() {
  vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
  vWorldPos = position;
  gl_Position = projectionMatrix * worldPos;
}
