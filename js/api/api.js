// ===== API MODULE =====
// Server ve Firebase API çağrıları

// ===== CONFIGURATION =====
export const FIREBASE_URL = 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app';
export const SERVER_URL = window.location.origin;

// ===== GAME SESSION =====
let gameSessionToken = null;
let lastScoreUpdate = 0;

export function getGameSessionToken() {
  return gameSessionToken;
}

export function setGameSessionToken(token) {
  gameSessionToken = token;
}

export function clearGameSessionToken() {
  gameSessionToken = null;
}

export function getLastScoreUpdate() {
  return lastScoreUpdate;
}

export function setLastScoreUpdate(time) {
  lastScoreUpdate = time;
}

// ===== AUTH API =====
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

// ===== USER DATA API =====
export async function loadUserData(username) {
  const response = await fetch(`${SERVER_URL}/api/userdata/${encodeURIComponent(username.toLowerCase())}`);
  const data = await response.json();
  return data;
}

export async function saveUserData(username, userData) {
  await fetch(`${SERVER_URL}/api/userdata/${encodeURIComponent(username.toLowerCase())}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
}

// ===== GAME SESSION API =====
export async function startGameSession(username, character, location) {
  try {
    const response = await fetch(`${SERVER_URL}/api/game/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, character, location })
    });
    const data = await response.json();
    if (data.sessionToken) {
      gameSessionToken = data.sessionToken;
      console.log('🎮 Game session started');
      return data.sessionToken;
    }
    return null;
  } catch (err) {
    console.log('Could not start secure session, using fallback');
    gameSessionToken = null;
    return null;
  }
}

export async function updateGameScore(score) {
  if (!gameSessionToken) return;
  if (Date.now() - lastScoreUpdate < 5000) return; // Rate limit
  
  lastScoreUpdate = Date.now();
  
  try {
    await fetch(`${SERVER_URL}/api/game/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionToken: gameSessionToken,
        score: Math.floor(score)
      })
    });
  } catch (err) {
    // Silent fail, don't block game
  }
}

export async function endGameSession(finalScore) {
  if (!gameSessionToken) {
    console.warn('⚠️ No game session - score will not be saved');
    return { isNewHighScore: false, score: 0 };
  }
  
  console.log('🔒 Submitting score via secure session');
  const response = await fetch(`${SERVER_URL}/api/game/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionToken: gameSessionToken,
      finalScore: Math.floor(finalScore)
    })
  });
  
  const result = await response.json();
  gameSessionToken = null; // Session consumed
  
  if (response.ok) {
    return {
      isNewHighScore: result.isNewHighScore,
      score: result.score
    };
  } else {
    console.warn('Score submission issue:', result);
    return { isNewHighScore: false, score: 0 };
  }
}

// ===== LEADERBOARD API =====
export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${SERVER_URL}/api/scores`);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

// ===== ARENA API (Firebase Direct) =====
export async function loadArenaRooms() {
  const response = await fetch(`${FIREBASE_URL}/arena.json`);
  const data = await response.json();
  return data || {};
}

export async function createArenaRoom(roomId, roomData) {
  await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  });
}

export async function getArenaRoom(roomId) {
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`);
  return await response.json();
}

export async function updateArenaRoom(roomId, path, data) {
  await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}.json`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function postArenaData(roomId, path, data) {
  await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}.json`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteArenaRoom(roomId) {
  await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'DELETE'
  });
}

// Arena ICE candidates
export async function sendIceCandidate(roomId, isHost, candidate) {
  const path = isHost ? 'hostCandidates' : 'guestCandidates';
  await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}.json`, {
    method: 'POST',
    body: JSON.stringify(candidate.toJSON())
  });
}

export async function getIceCandidates(roomId, isHost) {
  const path = isHost ? 'guestCandidates' : 'hostCandidates';
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}.json`);
  return await response.json();
}

export async function markCandidateAdded(roomId, isHost, key) {
  const path = isHost ? 'guestCandidates' : 'hostCandidates';
  await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}/${key}/_added.json`, {
    method: 'PUT',
    body: JSON.stringify(true)
  });
}
