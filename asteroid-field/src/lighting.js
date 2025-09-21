import * as THREE from 'three';

export function addLights(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(10, 15, 8);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(ambient, dir);
  return { ambient, dir };
}
