// ===== PROJECTILES SYSTEM =====
// Mermi ve skill projectile yönetimi

import { G } from '../state/gameState.js';
import { rand } from '../utils/helpers.js';

// ===== UPDATE PROJECTILES =====
export function updateProjectiles(dt, effectiveSpeed) {
  for (let i = G.projectiles.length - 1; i >= 0; i--) {
    const p = G.projectiles[i];
    
    // Update based on projectile type
    updateProjectileByType(p, dt, effectiveSpeed);
    
    // Update life
    if (p.life !== undefined) {
      p.life -= dt;
      if (p.life <= 0) {
        G.projectiles.splice(i, 1);
        continue;
      }
    }
    
    // Remove off-screen projectiles
    if (p.x < -100 || p.x > 600 || p.y < -100 || p.y > 700) {
      G.projectiles.splice(i, 1);
    }
  }
}

function updateProjectileByType(p, dt, effectiveSpeed) {
  switch (p.type) {
    case 'spear':
      if (p.extending && p.w < p.maxW) {
        p.w += 400 * dt;
      }
      break;
      
    case 'shuriken':
      p.x += p.vx * dt;
      p.spin += dt * 20;
      break;
      
    case 'waterBall':
      p.x += p.vx * dt;
      // Trail effect
      if (p.trail) {
        p.trail.push({ x: p.x, y: p.y, alpha: 1 });
        if (p.trail.length > 10) p.trail.shift();
        p.trail.forEach(t => t.alpha -= dt * 3);
      }
      break;
      
    case 'katanaSlash':
      p.slashPhase += dt * 15;
      break;
      
    case 'punch':
      p.punchPhase += dt * 10;
      p.x += 50 * dt;
      break;
      
    case 'poisonShot':
      p.x += p.vx * dt;
      p.spin += dt * 10;
      break;
      
    case 'needle':
      p.x += p.vx * dt;
      p.y += (p.vy || 0) * dt;
      p.glow += dt * 5;
      break;
      
    case 'eyeBeam':
      p.x += p.vx * dt;
      p.glow += dt * 10;
      break;
      
    case 'windWave':
      p.x += p.vx * dt;
      p.phase += dt * 10;
      p.w += 50 * dt;
      p.h += 30 * dt;
      break;
      
    case 'crowFeather':
      p.x += p.vx * dt;
      p.y += (p.vy || 0) * dt;
      p.spin += dt * 8;
      break;
      
    case 'paperThrow':
      p.x += p.vx * dt;
      p.y += (p.vy || 0) * dt;
      p.spin += dt * 12;
      break;
      
    case 'kissThrow':
      p.x += p.vx * dt;
      p.wobble += dt * 8;
      p.y += Math.sin(p.wobble) * 2;
      break;
      
    case 'illusionKill':
      p.x += p.vx * dt;
      p.phase += dt * 10;
      break;
      
    case 'arrowShot':
      p.x += p.vx * dt;
      break;
      
    case 'kunaiThrow':
      p.x += p.vx * dt;
      p.spin += dt * 15;
      break;
      
    case 'rasengan':
      p.x += p.vx * dt;
      // Rasengan clears all enemies it touches
      if (!p.cleared) {
        clearEnemiesInPath(p);
      }
      break;
      
    case 'metalShard':
      p.y += p.vy * dt;
      p.rotation += dt * 5;
      break;
      
    case 'puppetAttack':
      p.x += p.vx * dt;
      break;
      
    default:
      // Generic movement
      if (p.vx) p.x += p.vx * dt;
      if (p.vy) p.y += p.vy * dt;
  }
}

function clearEnemiesInPath(rasengan) {
  // Clear all obstacles within rasengan radius
  for (let i = G.obstacles.length - 1; i >= 0; i--) {
    const o = G.obstacles[i];
    const ox = o.x + o.w / 2;
    const oy = o.y - o.h / 2;
    const dist = Math.hypot(rasengan.x - ox, rasengan.y - oy);
    
    if (dist < rasengan.radius + 30) {
      // Create explosion particles
      for (let j = 0; j < 5; j++) {
        G.particles.push({
          x: ox, y: oy,
          vx: rand(-100, 100),
          vy: rand(-100, 50),
          life: rand(0.2, 0.4),
          color: '#3b82f6'
        });
      }
      G.obstacles.splice(i, 1);
    }
  }
}

// ===== CHECK PROJECTILE COLLISIONS =====
export function checkProjectileCollisions(obstacles, callbacks = {}) {
  for (let i = G.projectiles.length - 1; i >= 0; i--) {
    const p = G.projectiles[i];
    
    // Check collision with obstacles
    for (let j = obstacles.length - 1; j >= 0; j--) {
      const o = obstacles[j];
      
      if (projectileHitsObstacle(p, o)) {
        // Kill obstacle
        createDeathParticles(o);
        obstacles.splice(j, 1);
        
        // Some projectiles are consumed on hit
        if (shouldConsumeProjectile(p.type)) {
          G.projectiles.splice(i, 1);
          break;
        }
      }
    }
  }
}

function projectileHitsObstacle(p, o) {
  // Rectangle projectiles
  if (p.w && p.h) {
    const pRect = { x: p.x, y: p.y - p.h / 2, w: p.w, h: p.h };
    const oRect = { x: o.x, y: o.y - o.h, w: o.w, h: o.h };
    return rectsOverlap(pRect, oRect);
  }
  
  // Circle projectiles
  if (p.radius) {
    const ox = o.x + o.w / 2;
    const oy = o.y - o.h / 2;
    const dist = Math.hypot(p.x - ox, p.y - oy);
    return dist < p.radius + Math.max(o.w, o.h) / 2;
  }
  
  return false;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function shouldConsumeProjectile(type) {
  const nonConsumable = ['rasengan', 'metalShard', 'eyeBeam'];
  return !nonConsumable.includes(type);
}

function createDeathParticles(o) {
  const ox = o.x + o.w / 2;
  const oy = o.y - o.h / 2;
  
  for (let k = 0; k < 8; k++) {
    G.particles.push({
      x: ox, y: oy,
      vx: rand(-100, 100),
      vy: rand(-150, 50),
      life: rand(0.3, 0.5),
      color: o.color || '#ff6b6b'
    });
  }
}

// ===== UPDATE PARTICLES =====
export function updateParticles(dt) {
  for (let i = G.particles.length - 1; i >= 0; i--) {
    const p = G.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    
    if (p.life <= 0) {
      G.particles.splice(i, 1);
    }
  }
}
