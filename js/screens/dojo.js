// ===== DOJO MODULE =====
// Dojo mağaza işlemleri

import { G, permBonuses } from '../state/gameState.js';
import { DOJO_ITEMS } from '../data/items.js';

// Dojo item prices
export const DOJO_PRICES = {
  doubleJump: 3000,
  extraLife: 3000,
  airDash: 3000
};

// Check if can afford dojo item
export function canAffordDojoItem(itemKey) {
  const price = DOJO_PRICES[itemKey] || 3000;
  return G.coins >= price;
}

// Check if already owns dojo item
export function ownsDojoItem(itemKey) {
  switch (itemKey) {
    case 'doubleJump':
      return permBonuses.doubleJump === true;
    case 'airDash':
      return permBonuses.airDash === true;
    case 'extraLife':
      return false; // Can always buy more
    default:
      return false;
  }
}

// Purchase dojo item (returns success)
export function purchaseDojoItem(itemKey) {
  const price = DOJO_PRICES[itemKey] || 3000;
  
  if (G.coins < price) {
    return { success: false, error: 'Yeterli coin yok' };
  }
  
  switch (itemKey) {
    case 'doubleJump':
      if (permBonuses.doubleJump) {
        return { success: false, error: 'Zaten sahipsin' };
      }
      G.coins -= price;
      permBonuses.doubleJump = true;
      return { success: true };
      
    case 'airDash':
      if (permBonuses.airDash) {
        return { success: false, error: 'Zaten sahipsin' };
      }
      G.coins -= price;
      permBonuses.airDash = true;
      return { success: true };
      
    case 'extraLife':
      G.coins -= price;
      permBonuses.extraLives += 1;
      return { success: true };
      
    default:
      return { success: false, error: 'Bilinmeyen item' };
  }
}

// Get dojo item status for UI
export function getDojoItemStatus(itemKey) {
  const owned = ownsDojoItem(itemKey);
  const canAfford = canAffordDojoItem(itemKey);
  const price = DOJO_PRICES[itemKey] || 3000;
  
  return {
    owned,
    canAfford,
    price,
    buttonText: owned ? '✓ Alındı' : 'Satın Al',
    statusText: owned ? '✓ Sahipsin' : (itemKey === 'extraLife' ? `Mevcut: +${permBonuses.extraLives} can` : ''),
    disabled: owned || !canAfford
  };
}
