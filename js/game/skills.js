// ===== SKILLS SYSTEM =====
// Karakter yetenekleri (X ve F skills)

import { G, P } from '../state/gameState.js';
import { CHARACTERS } from '../data/characters.js';
import { rand } from '../utils/helpers.js';

// ===== SKILL X - ATTACK SKILLS =====
export function useSkillX(selectedChar, callbacks = {}) {
  if (!G.running || G.gameOver) return;
  if (G.skillXCooldown > 0) return;

  const char = CHARACTERS[selectedChar];
  if (!char) return;
  
  const pr = callbacks.getPlayerRect ? callbacks.getPlayerRect() : { x: P.x, y: P.y - P.h, w: P.w, h: P.h };

  // Skill X projeksiyonları
  createSkillXProjectile(char.skillX.action, pr, char);

  // Particles
  for (let i = 0; i < 8; i++) {
    G.particles.push({
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.4 + rand(-10, 10),
      vx: rand(50, 150),
      vy: rand(-40, 40),
      life: rand(0.2, 0.4),
      color: char.color
    });
  }

  G.skillXCooldown = char.skillX.cooldown;
  if (callbacks.updateUI) callbacks.updateUI();
}

// Create projectile based on skill type
function createSkillXProjectile(action, pr, char) {
  const projectileConfigs = {
    spearExtend: {
      type: 'spear',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.4,
      w: 120, h: 8,
      vx: 0, extending: true, maxW: 180, life: 0.5
    },
    shuriken: {
      type: 'shuriken',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.4,
      radius: 12, vx: 700, spin: 0, life: 3
    },
    waterBall: {
      type: 'waterBall',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.4,
      radius: 16, vx: 600, life: 3, trail: []
    },
    katanaSlash: {
      type: 'katanaSlash',
      x: pr.x + pr.w - 10,
      y: pr.y + pr.h * 0.3,
      w: 60, h: 50, vx: 0, life: 0.25, slashPhase: 0
    },
    punch: {
      type: 'punch',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.4,
      w: 50, h: 40, vx: 0, life: 0.3, punchPhase: 0
    },
    poisonShot: {
      type: 'poisonShot',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.35,
      w: 18, h: 18, vx: 400, spin: 0
    },
    eyeBeam: {
      type: 'eyeBeam',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.25,
      w: 200, h: 6, vx: 800, life: 0.8, glow: 0
    },
    windWave: {
      type: 'windWave',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.4,
      w: 40, h: 30, vx: 500, life: 2, phase: 0
    },
    illusionKill: {
      type: 'illusionKill',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.3,
      w: 40, h: 40, vx: 500, life: 2, phase: 0
    },
    arrowShot: {
      type: 'arrowShot',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.35,
      w: 45, h: 6, vx: 700, life: 2.5
    },
    kunaiThrow: {
      type: 'kunaiThrow',
      x: pr.x + pr.w,
      y: pr.y + pr.h * 0.35,
      w: 35, h: 10, vx: 650, life: 2, spin: 0
    }
  };

  // Multi-projectile skills
  if (action === 'needleThrow') {
    for (let i = 0; i < 5; i++) {
      G.projectiles.push({
        type: 'needle',
        x: pr.x + pr.w,
        y: pr.y + pr.h * 0.3 + i * 12,
        w: 30, h: 3,
        vx: 650 + i * 30,
        vy: (i - 2) * 20,
        life: 2,
        glow: Math.random() * Math.PI * 2
      });
    }
    return;
  }

  if (action === 'crowFeather') {
    for (let i = 0; i < 3; i++) {
      G.projectiles.push({
        type: 'crowFeather',
        x: pr.x + pr.w,
        y: pr.y + pr.h * 0.3 + i * 18,
        w: 35, h: 8,
        vx: 550 + i * 40,
        vy: (i - 1) * 30,
        life: 2.5,
        spin: Math.random() * Math.PI * 2
      });
    }
    return;
  }

  if (action === 'paperThrow') {
    for (let i = 0; i < 4; i++) {
      G.projectiles.push({
        type: 'paperThrow',
        x: pr.x + pr.w,
        y: pr.y + pr.h * 0.25 + i * 15,
        w: 30, h: 20,
        vx: 600 + i * 30,
        vy: (i - 1.5) * 40,
        life: 2,
        spin: 0
      });
    }
    return;
  }

  if (action === 'kissThrow') {
    for (let i = 0; i < 3; i++) {
      G.projectiles.push({
        type: 'kissThrow',
        x: pr.x + pr.w,
        y: pr.y + pr.h * 0.3,
        w: 25, h: 25,
        vx: 350 + i * 50,
        vy: Math.sin(i * 0.8) * 60 - 30,
        life: 2.5,
        phase: i * Math.PI / 3,
        wobble: 0
      });
    }
    return;
  }

  // Single projectile skills
  const config = projectileConfigs[action];
  if (config) {
    G.projectiles.push({ ...config });
  }
}

// ===== SKILL F - ULTIMATE SKILLS =====
export function useSkillF(selectedChar, canvas, callbacks = {}) {
  if (!G.running || G.gameOver) return;
  if (G.skillFCooldown > 0) return;
  if (G.ultActive) return;

  const char = CHARACTERS[selectedChar];
  if (!char) return;
  
  G.ultActive = true;
  G.ultTimer = char.skillF.duration * G.ultiDurationMultiplier;
  G.ultType = char.skillF.action;
  
  // Reset ulti multiplier after use
  G.ultiDurationMultiplier = 1;

  // Initialize ultimate state based on type
  initUltimateState(char.skillF.action);

  // Visual feedback
  if (canvas) canvas.classList.add('ult-active');

  // Particles burst
  createUltParticles(char.skillF.action);

  G.skillFCooldown = char.skillF.cooldown;
  if (callbacks.updateUI) callbacks.updateUI();
}

function initUltimateState(action) {
  switch (action) {
    case 'eagleFlight':
      G.eagleY = P.y;
      G.eagleTargetY = G.groundY - 220;
      P.onGround = false;
      break;
    case 'paperWings':
      G.paperWingsY = G.groundY - 180;
      P.onGround = false;
      break;
    case 'headbutt':
      P.onGround = false;
      G.headbuttY = G.groundY - 25;
      break;
    case 'swordStorm':
      G.swordStormTimer = 0;
      break;
    case 'arrowRain':
      G.arrowRainTimer = 0;
      break;
  }
}

function createUltParticles(action) {
  const colorMap = {
    moonlight: '#fff',
    eagleFlight: '#8b5cf6',
    swordStorm: '#e74c3c',
    headbutt: '#ecf0f1',
    poisonArmor: '#27ae60',
    monkeyFriend: '#8B4513',
    animalFriends: '#ff9f43',
    paperWings: '#ecf0f1',
    illusionStorm: '#9b59b6',
    windSword: '#3498db',
    darkAura: '#222',
    fireDragon: '#e74c3c',
    mysticLightning: '#f1c40f',
    arrowRain: '#3498db',
    shadowClone: '#8e44ad',
    iceStorm: '#67e8f9'
  };
  
  const color = colorMap[action] || '#67e8f9';
  
  for (let i = 0; i < 20; i++) {
    G.particles.push({
      x: P.x + P.w / 2 + rand(-30, 30),
      y: P.y - P.h / 2 + rand(-30, 30),
      vx: rand(-200, 200),
      vy: rand(-200, 50),
      life: rand(0.5, 1.0),
      color
    });
  }
}

// ===== UPDATE SKILLS =====
export function updateSkillCooldowns(dt) {
  if (G.skillXCooldown > 0) {
    // Rapid fire effect from Ishigakure Necklace
    const cdReduction = G.activeItem === 'ishigakure_necklace' ? 4 : 1;
    G.skillXCooldown = Math.max(0, G.skillXCooldown - dt * cdReduction);
  }
  
  if (G.skillFCooldown > 0) {
    G.skillFCooldown = Math.max(0, G.skillFCooldown - dt);
  }
}

// ===== END ULTIMATE =====
export function endUltimate(canvas) {
  G.ultActive = false;
  G.ultType = null;
  G.ultTimer = 0;
  if (canvas) canvas.classList.remove('ult-active');
}
