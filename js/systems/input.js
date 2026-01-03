// ===== INPUT SYSTEM =====
// Klavye ve dokunmatik giriş yönetimi

import { arenaState } from '../state/gameState.js';

// ===== ARENA KEYBOARD STATE =====
export const arenaKeys = {
  left: false,
  right: false,
  up: false,
  down: false,
  x: false,
  c: false
};

// ===== GAME INPUT CALLBACKS =====
let gameInputCallbacks = {
  jump: null,
  crouch: null,
  skillX: null,
  skillF: null,
  airDash: null,
  useItem: null,
  toggleShop: null,
  resetGame: null
};

// Set game input callbacks
export function setGameInputCallbacks(callbacks) {
  gameInputCallbacks = { ...gameInputCallbacks, ...callbacks };
}

// ===== ARENA INPUT CALLBACKS =====
let arenaInputCallbacks = {
  skillX: null,
  skillF: null
};

export function setArenaInputCallbacks(callbacks) {
  arenaInputCallbacks = { ...arenaInputCallbacks, ...callbacks };
}

// ===== INITIALIZE INPUT HANDLERS =====
export function initInputSystem(gameScreen, shopOverlay) {
  // Arena keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!arenaState.active) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a') arenaKeys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') arenaKeys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') arenaKeys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's') arenaKeys.down = true;
    if (e.key === 'x' || e.key === 'X') {
      arenaKeys.x = true;
      if (arenaInputCallbacks.skillX) arenaInputCallbacks.skillX();
    }
    if (e.key === 'c' || e.key === 'C') {
      arenaKeys.c = true;
      if (arenaInputCallbacks.skillF) arenaInputCallbacks.skillF();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') arenaKeys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') arenaKeys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') arenaKeys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') arenaKeys.down = false;
    if (e.key === 'x' || e.key === 'X') arenaKeys.x = false;
    if (e.key === 'c' || e.key === 'C') arenaKeys.c = false;
  });

  // Main game keyboard controls
  window.addEventListener('keydown', (e) => {
    if (gameScreen && gameScreen.classList.contains('active')) {
      const k = e.key.toLowerCase();
      
      if (k === ' ' || k === 'arrowup' || k === 'w') { 
        e.preventDefault(); 
        if (gameInputCallbacks.jump) gameInputCallbacks.jump(); 
      }
      if (k === 'arrowdown' || k === 's') { 
        e.preventDefault(); 
        if (gameInputCallbacks.crouch) gameInputCallbacks.crouch(true); 
      }
      if (k === 'x') { 
        e.preventDefault(); 
        if (gameInputCallbacks.skillX) gameInputCallbacks.skillX(); 
      }
      if (k === 'c') { 
        e.preventDefault(); 
        if (gameInputCallbacks.skillF) gameInputCallbacks.skillF(); 
      }
      if (k === 'r') { 
        e.preventDefault(); 
        if (gameInputCallbacks.resetGame) gameInputCallbacks.resetGame(); 
      }
      if (k === 'e') { 
        e.preventDefault(); 
        if (gameInputCallbacks.airDash) gameInputCallbacks.airDash(); 
      }
      // Item slots 1-2-3
      if (k === '1') { 
        e.preventDefault(); 
        if (gameInputCallbacks.useItem) gameInputCallbacks.useItem(0); 
      }
      if (k === '2') { 
        e.preventDefault(); 
        if (gameInputCallbacks.useItem) gameInputCallbacks.useItem(1); 
      }
      if (k === '3') { 
        e.preventDefault(); 
        if (gameInputCallbacks.useItem) gameInputCallbacks.useItem(2); 
      }
      // Z - Toggle item shop
      if (k === 'z') { 
        e.preventDefault(); 
        if (gameInputCallbacks.toggleShop) gameInputCallbacks.toggleShop();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowdown' || k === 's') {
      if (gameInputCallbacks.crouch) gameInputCallbacks.crouch(false);
    }
  });
}

// ===== TOUCH CONTROLS =====
export function initTouchControls(elements) {
  const { btnJump, btnCrouch, btnSkillX, btnSkillF, btnItem1, btnItem2, btnItem3 } = elements;
  
  if (btnJump) {
    btnJump.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.jump) gameInputCallbacks.jump();
    });
  }
  
  if (btnCrouch) {
    btnCrouch.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.crouch) gameInputCallbacks.crouch(true);
    });
    btnCrouch.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.crouch) gameInputCallbacks.crouch(false);
    });
  }
  
  if (btnSkillX) {
    btnSkillX.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.skillX) gameInputCallbacks.skillX();
    });
  }
  
  if (btnSkillF) {
    btnSkillF.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.skillF) gameInputCallbacks.skillF();
    });
  }
  
  if (btnItem1) {
    btnItem1.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.useItem) gameInputCallbacks.useItem(0);
    });
  }
  
  if (btnItem2) {
    btnItem2.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.useItem) gameInputCallbacks.useItem(1);
    });
  }
  
  if (btnItem3) {
    btnItem3.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (gameInputCallbacks.useItem) gameInputCallbacks.useItem(2);
    });
  }
}
