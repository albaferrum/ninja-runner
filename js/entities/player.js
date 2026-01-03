// ===== PLAYER ENTITY =====
// Oyuncu hareketi ve kontrolleri

import { G, P, permBonuses } from '../state/gameState.js';
import { rand } from '../utils/helpers.js';

// ===== PLAYER MOVEMENT =====
export function jump(callbacks = {}) {
  if (G.gameOver) { 
    if (callbacks.onReset) callbacks.onReset();
    return; 
  }
  if (!G.running) return;

  // Eagle flight: control height with jump
  if (G.ultActive && G.ultType === 'eagleFlight') {
    G.eagleTargetY = Math.max(100, G.eagleTargetY - 40);
    return;
  }
  
  // Paper wings: control height with jump
  if (G.ultActive && G.ultType === 'paperWings') {
    G.paperWingsY = Math.max(100, G.paperWingsY - 40);
    return;
  }

  if (P.onGround) {
    P.vy = P.jumpVel;
    P.onGround = false;
    G.hasDoubleJumped = false;
    G.hasAirDashed = false;
    G.onPlatform = null;
    
    // Jump particles
    for (let i = 0; i < 8; i++) {
      G.particles.push({
        x: P.x + rand(5, P.w - 5),
        y: G.groundY - rand(2, 8),
        vx: rand(-60, -20),
        vy: rand(-80, -30),
        life: rand(0.2, 0.35),
        color: '#888'
      });
    }
  } else if (G.canDoubleJump && !G.hasDoubleJumped) {
    // Double jump in air!
    P.vy = P.jumpVel * 0.85;
    G.hasDoubleJumped = true;
    G.hasAirDashed = false;
    
    // Double jump particles
    for (let i = 0; i < 10; i++) {
      G.particles.push({
        x: P.x + rand(5, P.w - 5),
        y: P.y - rand(10, 30),
        vx: rand(-50, 50),
        vy: rand(-60, -20),
        life: rand(0.2, 0.4),
        color: '#ffd700'
      });
    }
  }
}

export function crouch(on) {
  if (G.gameOver) return;
  
  // Eagle flight: control height with crouch
  if (G.ultActive && G.ultType === 'eagleFlight') {
    if (on) {
      G.eagleTargetY = Math.min(G.groundY - 80, G.eagleTargetY + 60);
    }
    return;
  }
  
  // Paper wings: control height with crouch
  if (G.ultActive && G.ultType === 'paperWings') {
    if (on) {
      G.paperWingsY = Math.min(G.groundY - 80, G.paperWingsY + 60);
    }
    return;
  }
  
  P.crouching = on;
  P.h = on ? P.crouchH : P.baseH;
}

export function airDash() {
  if (G.gameOver || !G.running) return;
  if (P.onGround) return;
  if (!G.canAirDash) return;
  if (G.hasAirDashed) return;
  
  G.hasAirDashed = true;
  G.airDashTimer = 0.15;
  
  // Dash particles
  for (let i = 0; i < 15; i++) {
    G.particles.push({
      x: P.x - rand(5, 30),
      y: P.y - P.h/2 + rand(-20, 20),
      vx: rand(-200, -100),
      vy: rand(-30, 30),
      life: rand(0.2, 0.4),
      color: '#00bfff'
    });
  }
}

// ===== PLAYER COLLISION RECT =====
export function playerRect() {
  return { x: P.x, y: P.y - P.h, w: P.w, h: P.h };
}

// ===== PLAYER UPDATE =====
export function updatePlayer(dt) {
  // Air dash movement
  if (G.airDashTimer > 0) {
    G.airDashTimer -= dt;
    P.x += 600 * dt; // Dash forward
    P.vy = 0; // Suspend gravity during dash
  }
  
  // Gravity (when not in special states)
  if (!G.ultActive || (G.ultType !== 'eagleFlight' && G.ultType !== 'paperWings')) {
    P.vy += G.gravity * dt;
  }
  
  // Apply velocity
  P.y += P.vy * dt;
  
  // Ground collision
  if (P.y >= G.groundY) {
    P.y = G.groundY;
    P.vy = 0;
    P.onGround = true;
    G.onPlatform = null;
  }
}
