precision mediump float;
varying vec3 vWorldPos;
uniform float uTime;

// simple 2D hash
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  // convert world pos to spherical-ish uv
  vec3 n = normalize(vWorldPos);
  float u = atan(n.z, n.x) / (2.0*3.14159265) + 0.5;
  float v = n.y * 0.5 + 0.5;
  vec2 uv = vec2(u, v);

  // base space tint (very dark blue)
  vec3 col = vec3(0.01, 0.02, 0.05);

  // multi-layer stars
  float star = 0.0;
  for (int i = 0; i < 3; i++) {
    float scale = float(1 << i) * 200.0;         // 200, 400, 800
    vec2 cell = floor(uv * scale);
    float h = hash(cell);
    // sparse stars
    if (h > 0.995) {
      // twinkle: vary brightness over time
      float tw = 0.5 + 0.5 * sin(uTime * (2.0 + h*8.0) + h*10.0);
      star += smoothstep(0.994, 1.0, h) * tw * 1.5;
    }
  }

  col += star; // add white-ish star glints
  gl_FragColor = vec4(col, 1.0);
}
