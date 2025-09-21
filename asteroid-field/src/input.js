export function makeInput() {
  const keys = new Set();
  window.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
  window.addEventListener('keyup',   e => keys.delete(e.key.toLowerCase()));
  const pressed = (k) => keys.has(k.toLowerCase());
  return { pressed };
}
