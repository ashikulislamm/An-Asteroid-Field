import * as THREE from 'three';

export function createSpaceship(texture) {
  const group = new THREE.Group();
  group.position.set(0, 1.5, 0);

  const mat = new THREE.MeshStandardMaterial({
    map: texture, metalness: 0.3, roughness: 0.7
  });

  // Fuselage
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3, 24, 1, false),
                              mat);
  body.rotation.z = Math.PI / 2; // point -Z
  body.castShadow = true;

  // Nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 24),
                              mat);
  nose.position.set(-1.9, 0, 0);
  nose.rotation.z = Math.PI / 2;
  nose.castShadow = true;

  // Tail
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 16),
                              mat);
  tail.position.set(2.1, 0, 0);
  tail.rotation.z = -Math.PI / 2;
  tail.castShadow = true;

  // Wings
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 2.0), mat);
  wingL.position.set(0, 0.0, -1.0);
  const wingR = wingL.clone();
  wingR.position.z = +1.0;

  // Add subtle emissive “engine” plane
  const engineMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4 });
  const engineGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), engineMat);
  engineGlow.position.set(2.4, 0, 0);
  engineGlow.rotation.y = Math.PI / 2;

  group.add(body, nose, tail, wingL, wingR, engineGlow);

  // Control state
  group.userData = {
    mat, // to swap texture later
    velocity: new THREE.Vector3(),
    yaw: 0, pitch: 0, roll: 0
  };

  return group;
}

/** Update spaceship physics & orientation from input */
export function updateSpaceship(ship, input, dt) {
  const UD = ship.userData;

  // Rotation controls
  const yawSpeed   = 1.5;   // left/right (arrow keys)
  const pitchSpeed = 1.2;   // up/down (arrow keys)
  const rollSpeed  = 2.0;   // aesthetic roll with A/D

  if (input.pressed('arrowleft'))  UD.yaw   += yawSpeed * dt;
  if (input.pressed('arrowright')) UD.yaw   -= yawSpeed * dt;
  if (input.pressed('arrowup'))    UD.pitch += pitchSpeed * dt;
  if (input.pressed('arrowdown'))  UD.pitch -= pitchSpeed * dt;

  // Roll with A/D, strafe with Q/E (optional)
  if (input.pressed('a')) UD.roll += rollSpeed * dt;
  if (input.pressed('d')) UD.roll -= rollSpeed * dt;

  // Limit pitch
  UD.pitch = Math.max(-0.7, Math.min(0.7, UD.pitch));

  // Build orientation quaternion (yaw around Y, pitch around Z->X, roll around Z)
  const q = new THREE.Quaternion()
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), UD.yaw))
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), UD.roll * 0.2))
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0))
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,0), 0));

  // Apply pitch around ship’s local X
  q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0)); // noop (kept for clarity)
  ship.quaternion.copy(q);
  ship.rotateX(UD.pitch);

  // Movement: W accelerate forward, S brake/reverse
  const acc = new THREE.Vector3(0,0,-1).applyQuaternion(ship.quaternion).multiplyScalar( input.pressed('w') ? 12 : (input.pressed('s') ? -6 : 0) );
  UD.velocity.addScaledVector(acc, dt);

  // Dampen velocity
  UD.velocity.multiplyScalar(Math.pow(0.98, 60 * dt));

  // Optional strafing (Q/E)
  if (input.pressed('q')) UD.velocity.add(new THREE.Vector3(-1,0,0).applyQuaternion(ship.quaternion).multiplyScalar(6*dt));
  if (input.pressed('e')) UD.velocity.add(new THREE.Vector3( 1,0,0).applyQuaternion(ship.quaternion).multiplyScalar(6*dt));

  // Move
  ship.position.addScaledVector(UD.velocity, dt);

  // Keep near center in Y
  if (ship.position.y < 0.5) ship.position.y = 0.5;
}
