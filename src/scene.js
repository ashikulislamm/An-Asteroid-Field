import * as THREE from 'three';

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 2000
  );
  camera.position.set(0, 2.5, 10);
  return camera;
}

export function handleResize(renderer, camera) {
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

/** Smooth camera follow behind a target (spaceship) */
export function followCameraUpdate(camera, target, dt, opts = {}) {
  const offsetDist = opts.offsetDist ?? 10;
  const offsetHeight = opts.offsetHeight ?? 2.5;
  const stiffness = opts.stiffness ?? 5; // higher = quicker follow

  // Where is “behind” the ship?
  const forward = new THREE.Vector3(0,0,-1).applyQuaternion(target.quaternion);
  const desiredPos = target.position.clone()
    .addScaledVector(forward, -offsetDist)
    .add(new THREE.Vector3(0, offsetHeight, 0));

  // Smooth approach
  camera.position.lerp(desiredPos, 1 - Math.exp(-stiffness * dt));
  camera.lookAt(target.position);
}
