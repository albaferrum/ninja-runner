// ===== ITEMS SYSTEM =====
// Oyun içi eşya kullanımı

import { G, P } from '../state/gameState.js';
import { SPECIAL_ITEMS } from '../data/items.js';
import { CHARACTERS } from '../data/characters.js';
import { rand } from '../utils/helpers.js';

// ===== USE ITEM =====
export function useItem(slotIndex, callbacks = {}) {
  if (!G.running || G.gameOver) return;
  
  const itemId = G.itemSlots[slotIndex];
  if (!itemId) return;
  
  const item = SPECIAL_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  
  // Check cooldown
  if (G.itemCooldowns[slotIndex] > 0) return;
  
  // Check if another item is active (except instant items)
  if (G.activeItem && item.duration > 0) return;
  
  // Apply item effect
  applyItemEffect(item, slotIndex, callbacks);
}

// ===== APPLY ITEM EFFECT =====
function applyItemEffect(item, slotIndex, callbacks = {}) {
  switch (item.effect) {
    case 'invincible':
      // Lightning Armor - invincibility
      G.activeItem = item.id;
      G.activeItemTimer = item.duration;
      removeItemFromSlot(item, slotIndex);
      break;
      
    case 'rapidFire':
      // Ishigakure Necklace - reduced X cooldown
      G.activeItem = item.id;
      G.activeItemTimer = item.duration;
      removeItemFromSlot(item, slotIndex);
      break;
      
    case 'extraLife':
      // Ancient Elixir - +1 life (instant, permanent)
      G.lives += 1;
      G.maxLives = Math.max(G.maxLives, G.lives);
      removeItemFromSlot(item, slotIndex);
      break;
      
    case 'rasengan':
      // Rasengan - clear enemies, boss damage
      fireRasengan(callbacks);
      removeItemFromSlot(item, slotIndex);
      break;
      
    case 'slowEnemies':
      // Viagra - slow enemies
      G.activeItem = item.id;
      G.activeItemTimer = item.duration;
      removeItemFromSlot(item, slotIndex);
      break;
      
    case 'summonPuppet':
      // Puppeteer's Parchment - summon shield character
      summonPuppet();
      removeItemFromSlot(item, slotIndex);
      break;
      
    case 'metalRain':
      // Iori's Katana - metal rain
      G.activeItem = 'iori_katana';
      G.activeItemTimer = item.duration;
      G.metalRainTimer = 0;
      G.ioriKatanaActive = true;
      removeItemFromSlot(item, slotIndex);
      break;
  }
  
  if (callbacks.updateUI) callbacks.updateUI();
}

// ===== HELPER FUNCTIONS =====
function removeItemFromSlot(item, slotIndex) {
  G.itemSlots[slotIndex] = null;
  G.ownedItems = G.ownedItems.filter(id => id !== item.id);
}

function fireRasengan(callbacks = {}) {
  const pr = callbacks.getPlayerRect ? callbacks.getPlayerRect() : { x: P.x, y: P.y - P.h, w: P.w, h: P.h };
  
  // Create rasengan projectile
  G.projectiles.push({
    type: 'rasengan',
    x: pr.x + pr.w,
    y: pr.y + pr.h * 0.4,
    radius: 30,
    vx: 500,
    life: 3,
    cleared: false
  });
  
  // Visual particles
  for (let i = 0; i < 20; i++) {
    G.particles.push({
      x: pr.x + pr.w + 20,
      y: pr.y + pr.h * 0.4,
      vx: rand(100, 300),
      vy: rand(-100, 100),
      life: rand(0.3, 0.6),
      color: '#3b82f6'
    });
  }
}

function summonPuppet() {
  const playableChars = Object.keys(CHARACTERS);
  const randomCharKey = playableChars[Math.floor(Math.random() * playableChars.length)];
  const char = CHARACTERS[randomCharKey];
  
  // Create puppet in front of player
  G.puppet = {
    charKey: randomCharKey,
    x: P.x + P.w + 50,
    y: G.groundY,
    w: 35,
    h: 58,
    hp: 1,
    phase: 0,
    timer: 15,
    attackCooldown: 0,
    attackRate: char.skillX.cooldown * 0.5
  };
  
  // Summon particles
  for (let i = 0; i < 15; i++) {
    G.particles.push({
      x: G.puppet.x + 15,
      y: G.puppet.y - 30,
      vx: rand(-100, 100),
      vy: rand(-150, -50),
      life: rand(0.4, 0.7),
      color: '#a855f7'
    });
  }
}

// ===== UPDATE ITEM EFFECTS =====
export function updateItemEffects(dt) {
  // Update active item timer
  if (G.activeItem && G.activeItemTimer > 0) {
    G.activeItemTimer -= dt;
    
    if (G.activeItemTimer <= 0) {
      // Item effect ended
      if (G.activeItem === 'iori_katana') {
        G.ioriKatanaActive = false;
      }
      G.activeItem = null;
      G.activeItemTimer = 0;
    }
  }
  
  // Update item cooldowns
  for (let i = 0; i < G.itemCooldowns.length; i++) {
    if (G.itemCooldowns[i] > 0) {
      G.itemCooldowns[i] = Math.max(0, G.itemCooldowns[i] - dt);
    }
  }
  
  // Update metal rain
  if (G.ioriKatanaActive) {
    G.metalRainTimer = (G.metalRainTimer || 0) + dt;
    if (G.metalRainTimer >= 0.15) {
      G.metalRainTimer = 0;
      spawnMetalShard();
    }
  }
}

function spawnMetalShard() {
  G.projectiles.push({
    type: 'metalShard',
    x: rand(50, 430),
    y: -20,
    w: rand(15, 25),
    h: rand(40, 60),
    vx: 0,
    vy: 600,
    life: 2,
    rotation: rand(0, Math.PI * 2)
  });
}

// ===== UPDATE PUPPET =====
export function updatePuppet(dt, effectiveSpeed) {
  if (!G.puppet) return;
  
  const puppet = G.puppet;
  puppet.timer -= dt;
  puppet.phase += dt * 5;
  
  // Move with game speed
  puppet.x -= effectiveSpeed * dt * 0.3;
  
  // Keep puppet in front of player
  if (puppet.x < P.x + P.w + 20) {
    puppet.x = P.x + P.w + 20;
  }
  
  // Attack cooldown
  puppet.attackCooldown -= dt;
  
  // Puppet attacks nearby enemies
  if (puppet.attackCooldown <= 0) {
    puppetAttack();
    puppet.attackCooldown = puppet.attackRate;
  }
  
  // Remove puppet when timer expires or HP depleted
  if (puppet.timer <= 0 || puppet.hp <= 0) {
    // Death particles
    for (let i = 0; i < 10; i++) {
      G.particles.push({
        x: puppet.x + puppet.w / 2,
        y: puppet.y - puppet.h / 2,
        vx: rand(-100, 100),
        vy: rand(-100, 50),
        life: rand(0.3, 0.5),
        color: '#a855f7'
      });
    }
    G.puppet = null;
  }
}

function puppetAttack() {
  if (!G.puppet) return;
  
  const puppet = G.puppet;
  const char = CHARACTERS[puppet.charKey];
  if (!char) return;
  
  // Create a projectile from puppet
  G.projectiles.push({
    type: 'puppetAttack',
    x: puppet.x + puppet.w,
    y: puppet.y - puppet.h / 2,
    w: 25,
    h: 25,
    vx: 400,
    life: 1.5,
    color: char.color
  });
}
