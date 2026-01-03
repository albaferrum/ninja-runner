// ===== SCROLLS ENTITY =====
// Tomarlar (power-ups) sistemi

import { G } from '../state/gameState.js';
import { rand } from '../utils/helpers.js';

// ===== CONSTANTS =====
const WORLD_W = 480;

// ===== SCROLL TYPES =====
export const SCROLL_TYPES = [
  { type: 'blue', color: '#3b82f6', effect: 'life', label: '❤️' },
  { type: 'red', color: '#ef4444', effect: 'ultiBoost', label: '⚡' },
  { type: 'yellow', color: '#eab308', effect: 'scoreBoost', label: '💰' }
];

// ===== SPAWN SCROLL =====
export function spawnScroll() {
  const scrollType = SCROLL_TYPES[Math.floor(Math.random() * SCROLL_TYPES.length)];
  G.scrolls.push({
    x: WORLD_W + 50,
    y: G.groundY - rand(80, 200),
    w: 35,
    h: 45,
    type: scrollType.type,
    color: scrollType.color,
    effect: scrollType.effect,
    label: scrollType.label,
    bobPhase: rand(0, Math.PI * 2)
  });
}

// ===== UPDATE SCROLLS =====
export function updateScrolls(dt, effectiveSpeed) {
  // Spawn timer
  if (!G.bossActive) {
    G.scrollSpawnTimer -= dt;
    if (G.scrollSpawnTimer <= 0) {
      if (Math.random() < 0.3) {
        spawnScroll();
      }
      G.scrollSpawnTimer = rand(8, 15);
    }
  }
  
  // Update scrolls
  for (let i = G.scrolls.length - 1; i >= 0; i--) {
    const s = G.scrolls[i];
    s.x -= effectiveSpeed * dt;
    s.bobPhase += dt * 2;
    
    // Remove off-screen
    if (s.x + s.w < 0) {
      G.scrolls.splice(i, 1);
    }
  }
}

// ===== COLLECT SCROLL =====
export function collectScroll(scroll, callbacks = {}) {
  switch (scroll.effect) {
    case 'life':
      if (G.lives < G.maxLives) {
        G.lives++;
        if (callbacks.onLifeGain) callbacks.onLifeGain();
      }
      break;
    case 'ultiBoost':
      G.ultiDurationMultiplier = 1.5;
      if (callbacks.onUltiBoost) callbacks.onUltiBoost();
      break;
    case 'scoreBoost':
      G.scoreMultiplier = 2;
      G.scoreMultiplierTimer = 10;
      if (callbacks.onScoreBoost) callbacks.onScoreBoost();
      break;
  }
  
  // Remove scroll
  const idx = G.scrolls.indexOf(scroll);
  if (idx > -1) {
    G.scrolls.splice(idx, 1);
  }
}
