// ===== BOSS DEFINITIONS =====
// Tüm boss karakterlerinin tanımları

export const BOSS = {
  name: 'Raijin',
  maxHp: 100,
  width: 80,
  height: 120,
  x: 400,
  attackCooldown: 2.5,
  ultiCooldown: 12,
  ultiDuration: 3
};

export const BOSS_MAXDOWN = {
  name: 'MAXDOWN',
  maxHp: 1500,
  width: 120,
  height: 160,
  x: 400,
  attackCooldown: 2.0,
  laserCooldown: 4,
  laserDuration: 0.8
};

// Tüm boss türleri
export const BOSS_TYPES = {
  riaru: BOSS,
  maxdown: BOSS_MAXDOWN
};

// Boss bilgisi al
export function getBoss(type) {
  return BOSS_TYPES[type] || null;
}
