// ===== CANVAS UTILITIES =====
// Canvas yardımcı fonksiyonları ve karakter çizimi

import { CHARACTERS } from '../data/characters.js';

// ===== CHARACTER AVATAR DRAWING =====
export function drawCharacterAvatar(charKey, size = 140) {
  const char = CHARACTERS[charKey];
  if (!char) return null;
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const centerX = size / 2;
  const centerY = size / 2;
  const scale = size / 140; // Base scale
  
  ctx.save();
  ctx.translate(centerX, centerY + 10 * scale);
  
  // Body
  ctx.fillStyle = '#2a2a3a';
  ctx.beginPath();
  ctx.roundRect(-17 * scale, -15 * scale, 34 * scale, 50 * scale, 8 * scale);
  ctx.fill();
  
  // Head
  const headSize = char.isSmall ? 14 : (char.isBig ? 24 : 18);
  const headY = -25 * scale;
  
  // Skin
  ctx.fillStyle = char.skinColor || '#f5deb3';
  ctx.beginPath();
  ctx.arc(0, headY, headSize * scale * 0.6, 0, Math.PI * 2);
  ctx.fill();
  
  // Hair
  ctx.fillStyle = char.hairColor;
  ctx.beginPath();
  
  if (charKey === 'usagi') {
    // Long golden hair
    ctx.ellipse(0, headY - 5 * scale, 12 * scale, 8 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-12 * scale, headY - 5 * scale, 5 * scale, 35 * scale);
    ctx.fillRect(7 * scale, headY - 5 * scale, 5 * scale, 35 * scale);
  } else if (charKey === 'haru') {
    // White long hair
    ctx.ellipse(0, headY - 5 * scale, 11 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-13 * scale, headY - 5 * scale, 4 * scale, 40 * scale);
    ctx.fillRect(9 * scale, headY - 5 * scale, 4 * scale, 40 * scale);
  } else if (charKey === 'ringo') {
    // Spiky blue hair
    ctx.ellipse(0, headY - 5 * scale, 10 * scale, 6 * scale, 0, Math.PI, 0);
    ctx.fill();
    // Spikes
    ctx.beginPath();
    ctx.moveTo(-8 * scale, headY - 5 * scale);
    ctx.lineTo(-12 * scale, headY - 18 * scale);
    ctx.lineTo(-4 * scale, headY - 7 * scale);
    ctx.lineTo(0, headY - 22 * scale);
    ctx.lineTo(4 * scale, headY - 7 * scale);
    ctx.lineTo(12 * scale, headY - 15 * scale);
    ctx.lineTo(8 * scale, headY - 5 * scale);
    ctx.fill();
  } else if (charKey === 'chisa') {
    // Twin tails
    ctx.ellipse(0, headY - 4 * scale, 9 * scale, 6 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-9 * scale, headY + 5 * scale, 3 * scale, 10 * scale, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(9 * scale, headY + 5 * scale, 3 * scale, 10 * scale, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Ribbons
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(-9 * scale, headY - 2 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.arc(9 * scale, headY - 2 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else if (charKey === 'butsuo') {
    // Short spiky white
    ctx.ellipse(0, headY - 4 * scale, 14 * scale, 9 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10 * scale, headY - 5 * scale);
    ctx.lineTo(-15 * scale, headY - 12 * scale);
    ctx.lineTo(-6 * scale, headY - 7 * scale);
    ctx.lineTo(0, headY - 16 * scale);
    ctx.lineTo(6 * scale, headY - 7 * scale);
    ctx.lineTo(15 * scale, headY - 12 * scale);
    ctx.lineTo(10 * scale, headY - 5 * scale);
    ctx.fill();
  } else if (charKey === 'teki') {
    // Short wavy
    ctx.ellipse(0, headY - 4 * scale, 10 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
  } else if (charKey === 'susumu') {
    // Long white hair
    ctx.ellipse(0, headY - 4 * scale, 12 * scale, 8 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-13 * scale, headY - 4 * scale, 5 * scale, 40 * scale);
    ctx.fillRect(8 * scale, headY - 4 * scale, 5 * scale, 40 * scale);
  } else if (charKey === 'shinji') {
    // Long purple
    ctx.ellipse(0, headY - 4 * scale, 11 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-12 * scale, headY - 4 * scale, 4 * scale, 30 * scale);
    ctx.fillRect(8 * scale, headY - 4 * scale, 4 * scale, 30 * scale);
  } else if (charKey === 'kazuya') {
    // Purple spiky
    ctx.ellipse(0, headY - 4 * scale, 10 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6 * scale, headY - 5 * scale);
    ctx.lineTo(-10 * scale, headY - 18 * scale);
    ctx.lineTo(-2 * scale, headY - 8 * scale);
    ctx.lineTo(3 * scale, headY - 20 * scale);
    ctx.lineTo(8 * scale, headY - 7 * scale);
    ctx.lineTo(14 * scale, headY - 14 * scale);
    ctx.lineTo(10 * scale, headY - 5 * scale);
    ctx.fill();
  } else if (charKey === 'togami') {
    // Blue-gray hair
    ctx.ellipse(0, headY - 4 * scale, 10 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
  } else if (charKey === 'kagi') {
    // Long black hair
    ctx.ellipse(0, headY - 4 * scale, 11 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-12 * scale, headY - 4 * scale, 5 * scale, 45 * scale);
    ctx.fillRect(7 * scale, headY - 4 * scale, 5 * scale, 45 * scale);
  } else if (charKey === 'akemi') {
    // Long blonde
    ctx.ellipse(0, headY - 4 * scale, 12 * scale, 8 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-13 * scale, headY - 4 * scale, 5 * scale, 42 * scale);
    ctx.fillRect(8 * scale, headY - 4 * scale, 5 * scale, 42 * scale);
  } else if (charKey === 'ryoken') {
    // Blonde spiky
    ctx.ellipse(0, headY - 4 * scale, 11 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-8 * scale, headY - 5 * scale);
    ctx.lineTo(-14 * scale, headY - 16 * scale);
    ctx.lineTo(-4 * scale, headY - 8 * scale);
    ctx.lineTo(2 * scale, headY - 20 * scale);
    ctx.lineTo(8 * scale, headY - 7 * scale);
    ctx.lineTo(16 * scale, headY - 14 * scale);
    ctx.lineTo(10 * scale, headY - 5 * scale);
    ctx.fill();
  } else if (charKey === 'riku') {
    // White short
    ctx.ellipse(0, headY - 4 * scale, 9 * scale, 6 * scale, 0, Math.PI, 0);
    ctx.fill();
  } else if (charKey === 'joaryu') {
    // Medium purple hair
    ctx.ellipse(0, headY - 4 * scale, 11 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-12 * scale, headY - 4 * scale, 4 * scale, 20 * scale);
    ctx.fillRect(8 * scale, headY - 4 * scale, 4 * scale, 20 * scale);
  } else {
    // Default hair
    ctx.ellipse(0, headY - 4 * scale, 10 * scale, 7 * scale, 0, Math.PI, 0);
    ctx.fill();
  }
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(-5 * scale, headY - 2 * scale, 2 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(5 * scale, headY - 2 * scale, 2 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-4 * scale, headY - 3 * scale, 1 * scale, 0, Math.PI * 2);
  ctx.arc(6 * scale, headY - 3 * scale, 1 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  // Outfit accent color
  ctx.fillStyle = char.color;
  ctx.beginPath();
  ctx.roundRect(-15 * scale, 5 * scale, 30 * scale, 8 * scale, 3 * scale);
  ctx.fill();
  
  ctx.restore();
  
  return canvas;
}

// Generate all character avatars
export function generateAllAvatars() {
  const charKeys = Object.keys(CHARACTERS);
  charKeys.forEach(charKey => {
    const container = document.getElementById('avatar-' + charKey);
    if (container) {
      const avatarCanvas = drawCharacterAvatar(charKey, 140);
      if (avatarCanvas) {
        container.appendChild(avatarCanvas);
      }
    }
  });
}
