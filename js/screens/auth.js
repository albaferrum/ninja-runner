// ===== AUTH MODULE =====
// Kullanıcı girişi ve kayıt işlemleri

import { G, permBonuses } from '../state/gameState.js';
import { SERVER_URL } from '../api/api.js';

// Current user state
export let currentUser = null;
export let nickname = '';

// Set current user
export function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    nickname = user.username;
    localStorage.setItem('ninja_user', JSON.stringify(user));
  } else {
    nickname = '';
    localStorage.removeItem('ninja_user');
  }
}

// Get saved user from localStorage
export function getSavedUser() {
  try {
    const saved = localStorage.getItem('ninja_user');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading saved user:', e);
  }
  return null;
}

// Load user data from server
export async function loadUserData(username) {
  try {
    const response = await fetch(`${SERVER_URL}/api/userdata/${encodeURIComponent(username.toLowerCase())}`);
    const data = await response.json();
    if (data) {
      if (typeof data.coins === 'number') {
        G.coins = data.coins;
      } else {
        G.coins = 0;
      }
      // Load permanent bonuses
      permBonuses.doubleJump = data.doubleJump || false;
      permBonuses.extraLives = data.extraLives || 0;
      permBonuses.airDash = data.airDash || false;
    } else {
      G.coins = 0;
      permBonuses.doubleJump = false;
      permBonuses.extraLives = 0;
      permBonuses.airDash = false;
    }
    return data;
  } catch (err) {
    console.error('Error loading user data:', err);
    G.coins = 0;
    permBonuses.doubleJump = false;
    permBonuses.extraLives = 0;
    permBonuses.airDash = false;
    return null;
  }
}

// Register new user
export async function registerUser(username, email, password) {
  const response = await fetch(`${SERVER_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Kayıt başarısız');
  }
  
  return result;
}

// Login user
export async function loginUser(username, password) {
  const response = await fetch(`${SERVER_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Giriş başarısız');
  }
  
  return result;
}

// Logout user
export function logoutUser() {
  currentUser = null;
  nickname = '';
  G.coins = 0;
  permBonuses.doubleJump = false;
  permBonuses.extraLives = 0;
  permBonuses.airDash = false;
  localStorage.removeItem('ninja_user');
}

// Check if user is logged in
export function isLoggedIn() {
  return currentUser !== null;
}
