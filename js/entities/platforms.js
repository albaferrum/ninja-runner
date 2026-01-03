// ===== PLATFORMS ENTITY =====
// Platform sistemi

import { G, P } from '../state/gameState.js';
import { rand } from '../utils/helpers.js';

// ===== CONSTANTS =====
const WORLD_W = 480;

// ===== PLATFORM SPAWNING =====
export function spawnPlatform() {
  const width = rand(150, 250);
  const height = rand(100, 180);
  
  G.platforms.push({
    x: WORLD_W + 50,
    y: G.groundY - height,
    w: width,
    h: 18,
    type: Math.random() < 0.3 ? 'wood' : 'stone'
  });
}

// ===== UPDATE PLATFORMS =====
export function updatePlatforms(dt, effectiveSpeed) {
  // Spawn timer (only when not in boss fight)
  if (!G.bossActive) {
    G.platformSpawnTimer -= dt;
    if (G.platformSpawnTimer <= 0) {
      if (Math.random() < 0.4) {
        spawnPlatform();
      }
      G.platformSpawnTimer = rand(3, 6);
    }
  }
  
  // Update platforms
  for (let i = G.platforms.length - 1; i >= 0; i--) {
    const p = G.platforms[i];
    p.x -= effectiveSpeed * dt;
    
    // Remove off-screen platforms
    if (p.x + p.w < 0) {
      // If player was on this platform, they're now falling
      if (G.onPlatform === p) {
        G.onPlatform = null;
        P.onGround = false;
      }
      G.platforms.splice(i, 1);
    }
  }
  
  // Check if player is on a platform
  checkPlatformCollision();
}

// ===== PLATFORM COLLISION =====
export function checkPlatformCollision() {
  // Skip if in special flight modes
  if (G.ultActive && (G.ultType === 'eagleFlight' || G.ultType === 'paperWings')) {
    return;
  }
  
  const playerBottom = P.y;
  const playerLeft = P.x;
  const playerRight = P.x + P.w;
  
  // Check if player lands on any platform
  for (const plat of G.platforms) {
    const platTop = plat.y;
    const platLeft = plat.x;
    const platRight = plat.x + plat.w;
    
    // Check if player is above platform and falling
    if (P.vy >= 0 && 
        playerBottom <= platTop + 10 && 
        playerBottom >= platTop - 20 &&
        playerRight > platLeft && 
        playerLeft < platRight) {
      P.y = platTop;
      P.vy = 0;
      P.onGround = true;
      G.onPlatform = plat;
      G.hasDoubleJumped = false;
      G.hasAirDashed = false;
      return;
    }
  }
  
  // If was on platform but no longer over it
  if (G.onPlatform) {
    const plat = G.onPlatform;
    const platLeft = plat.x;
    const platRight = plat.x + plat.w;
    
    if (playerRight <= platLeft || playerLeft >= platRight) {
      G.onPlatform = null;
      P.onGround = false;
    }
  }
}
