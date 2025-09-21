import * as THREE from 'three';
import { createRenderer, createScene, createCamera, handleResize, followCameraUpdate } from './scene.js';
import { addLights } from './lighting.js';
import { makeInput } from './input.js';
import { createAsteroidTexture, createSpaceshipTexture } from './textures.js';
import { createSpaceship, updateSpaceship } from './spaceship.js';
import { createAsteroid, updateAsteroid } from './asteroids.js';

import starVert from './shaders/starfield.vert.glsl?raw';
import starFrag from './shaders/starfield.frag.glsl?raw';

const canvas = document.getElementById('app');
const renderer = createRenderer(canvas);
const scene = createScene();
const camera = createCamera();
handleResize(renderer, camera);

addLights(scene);

// === Custom Shader Sky (big inside-out sphere) ===
const skyGeo = new THREE.SphereGeometry(1000, 64, 64);
const skyMat = new THREE.ShaderMaterial({
  vertexShader: starVert,
  fragmentShader: starFrag,
  side: THREE.BackSide,
  uniforms: { uTime: { value: 0 } },
  depthWrite: false
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

// === Textures ===
const asteroidTex = createAsteroidTexture(256);
const shipTexBlue = createSpaceshipTexture('blue', 512);
const shipTexRed  = createSpaceshipTexture('red',  512);
// Improve texture quality
const maxAniso = renderer.capabilities.getMaxAnisotropy();
[asteroidTex, shipTexBlue, shipTexRed].forEach(t => t.anisotropy = maxAniso);

// === Spaceship ===
const ship = createSpaceship(shipTexBlue);
scene.add(ship);

// === Asteroid field ===
const asteroids = [];
for (let i = 0; i < 120; i++) {
  const a = createAsteroid(asteroidTex);
  scene.add(a);
  asteroids.push(a);
}

// === Mouse: toggle spaceship texture on click ===
let usingBlue = true;
window.addEventListener('pointerdown', () => {
  usingBlue = !usingBlue;
  ship.userData.mat.map = usingBlue ? shipTexBlue : shipTexRed;
  ship.userData.mat.needsUpdate = true;
});

// === Keyboard input ===
const input = makeInput();

// Optional ground reference (very dim) – not required
// const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x030303, side: THREE.DoubleSide }));
// ground.rotation.x = -Math.PI/2;
// ground.receiveShadow = true;
// scene.add(ground);

// === Animation loop ===
const clock = new THREE.Clock();

function loop() {
  const dt = clock.getDelta();

  // Update shader time
  sky.material.uniforms.uTime.value += dt;

  // Update spaceship
  updateSpaceship(ship, input, dt);

  // Camera follows the spaceship
  followCameraUpdate(camera, ship, dt, { offsetDist: 12, offsetHeight: 3, stiffness: 4.5 });

  // Update asteroids
  for (const a of asteroids) updateAsteroid(a, dt);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
