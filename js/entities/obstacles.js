// ===== OBSTACLES ENTITY =====
// Düşman ve engel yönetimi

import { G } from '../state/gameState.js';
import { rand } from '../utils/helpers.js';

// ===== CONSTANTS =====
const WORLD_W = 480;

// ===== OBSTACLE SPAWNING =====
export function spawnObstacle() {
  const roll = Math.random();
  if (roll < 0.65) {
    // Ground enemy (ninja)
    const w = rand(30, 45);
    const h = rand(50, 70);
    G.obstacles.push({ 
      type: 'enemy', 
      x: WORLD_W + 40, 
      y: G.groundY, 
      w, h, 
      hitPad: 6,
      color: `hsl(${rand(0, 360)}, 50%, 40%)`
    });
  } else {
    // Flying enemy (bird/kunai)
    const y = G.groundY - (Math.random() < 0.5 ? 80 : 140);
    G.obstacles.push({ 
      type: 'flying', 
      x: WORLD_W + 40, 
      y, 
      w: 50, h: 28, 
      hitPad: 8,
      phase: 0 
    });
  }
}

// ===== OBSTACLE RECT =====
export function obstacleRect(o) {
  return { x: o.x, y: o.y - o.h, w: o.w, h: o.h };
}

// ===== COLLISION CHECK =====
export function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ===== UPDATE OBSTACLES =====
export function updateObstacles(dt, effectiveSpeed) {
  for (let i = G.obstacles.length - 1; i >= 0; i--) {
    const o = G.obstacles[i];
    o.x -= effectiveSpeed * dt;
    
    // Flying enemies bob up and down
    if (o.type === 'flying') {
      o.phase += dt * 3;
      o.bobY = Math.sin(o.phase) * 15;
    }
    
    // Remove off-screen obstacles
    if (o.x < -100) {
      G.obstacles.splice(i, 1);
    }
  }
}

// ===== CLEAR ALL OBSTACLES =====
export function clearObstacles() {
  G.obstacles = [];
}
