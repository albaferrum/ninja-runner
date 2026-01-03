// ===== UTILITY FUNCTIONS =====
// Yardımcı fonksiyonlar

// ===== MATH HELPERS =====
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rand = (a, b) => a + Math.random() * (b - a);
export const lerp = (a, b, t) => a + (b - a) * t;
export const randInt = (a, b) => Math.floor(rand(a, b + 1));

// ===== COLLISION DETECTION =====
export function rectIntersect(r1, r2) {
  return !(r1.x + r1.w < r2.x ||
           r2.x + r2.w < r1.x ||
           r1.y + r1.h < r2.y ||
           r2.y + r2.h < r1.y);
}

export function circleRectIntersect(cx, cy, r, rx, ry, rw, rh) {
  const closestX = clamp(cx, rx, rx + rw);
  const closestY = clamp(cy, ry, ry + rh);
  const distX = cx - closestX;
  const distY = cy - closestY;
  return (distX * distX + distY * distY) < (r * r);
}

// ===== PARTICLE HELPERS =====
export function createParticle(x, y, color, vx, vy, life = 0.5) {
  return {
    x, y, color,
    vx: vx || rand(-50, 50),
    vy: vy || rand(-100, -50),
    life,
    maxLife: life
  };
}

export function createExplosion(x, y, color, count = 10) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = rand(50, 150);
    particles.push(createParticle(
      x, y, color,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      rand(0.3, 0.6)
    ));
  }
  return particles;
}

// ===== DOM HELPERS =====
export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

// ===== STORAGE HELPERS =====
export function getStoredUser() {
  try {
    const data = localStorage.getItem('ninja_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem('ninja_user', JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem('ninja_user');
}

// ===== ARENA HELPERS =====
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ===== FORMAT HELPERS =====
export function formatScore(score) {
  return Math.floor(score).toLocaleString();
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
