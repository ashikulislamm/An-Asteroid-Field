import * as THREE from 'three';

function makeJaggedGeometry(radius) {
  const geo = new THREE.IcosahedronGeometry(radius, 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const noise = 1 + (Math.random() * 0.45 - 0.2); // outward/inward
    v.multiplyScalar(noise);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createAsteroid(texture) {
  const r = THREE.MathUtils.randFloat(0.4, 2.0);
  const geo = makeJaggedGeometry(r);
  const mat = new THREE.MeshStandardMaterial({
    map: texture, roughness: 1.0, metalness: 0.0
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = false;

  // Random start position in a big box in front of the camera
  mesh.position.set(
    THREE.MathUtils.randFloatSpread(120),
    THREE.MathUtils.randFloatSpread(60) + 5,
    THREE.MathUtils.randFloat(-400, -40)
  );

  // Random spin & drift
  mesh.userData.rot = new THREE.Vector3(
    THREE.MathUtils.randFloat(-0.5, 0.5),
    THREE.MathUtils.randFloat(-0.5, 0.5),
    THREE.MathUtils.randFloat(-0.5, 0.5)
  );
  mesh.userData.speed = THREE.MathUtils.randFloat(8, 25); // towards +Z
  return mesh;
}

export function updateAsteroid(mesh, dt) {
  const u = mesh.userData;
  mesh.rotation.x += u.rot.x * dt;
  mesh.rotation.y += u.rot.y * dt;
  mesh.rotation.z += u.rot.z * dt;
  mesh.position.z += u.speed * dt;

  // Wrap when it passes the camera
  if (mesh.position.z > 30) {
    mesh.position.z = THREE.MathUtils.randFloat(-500, -200);
    mesh.position.x = THREE.MathUtils.randFloatSpread(120);
    mesh.position.y = THREE.MathUtils.randFloatSpread(60) + 5;
  }
}
