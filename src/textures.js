import * as THREE from 'three';

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

/** Rocky speckled texture for asteroids */
export function createAsteroidTexture(size = 256) {
  const { canvas, ctx } = makeCanvas(size, size);

  // Base rock color
  ctx.fillStyle = '#6b6b6b';
  ctx.fillRect(0, 0, size, size);

  // Speckles
  for (let i = 0; i < size * 10; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.5 + 0.2;
    const shade = Math.floor(80 + Math.random() * 80);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // Subtle vignette
  const grad = ctx.createRadialGradient(size/2, size/2, 10, size/2, size/2, size/1.2);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,size,size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1,1);
  return tex;
}

/** Sleek panel texture for spaceship (two variants to toggle with mouse) */
export function createSpaceshipTexture(variant = 'blue', size = 512) {
  const { canvas, ctx } = makeCanvas(size, size);

  // Background panel color
  const base = variant === 'red' ? '#4a2424' : '#24354a';
  ctx.fillStyle = base;
  ctx.fillRect(0,0,size,size);

  // Panel grid
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  const step = 64;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,size); ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(size,y); ctx.stroke();
  }

  // Rivets
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let y = step/2; y < size; y += step) {
    for (let x = step/2; x < size; x += step) {
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
    }
  }

  // Bright stripe
  ctx.fillStyle = variant === 'red' ? '#b34b4b' : '#4bb3b3';
  ctx.fillRect(0, size*0.45, size, size*0.1);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}
