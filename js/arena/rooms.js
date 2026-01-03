// ===== ARENA ROOMS MODULE =====
// Arena oda yönetimi (Firebase işlemleri)

import { FIREBASE_URL } from '../api/api.js';
import { generateRoomCode } from './config.js';

// Create a new arena room
export async function createArenaRoom(roomId, hostData, offerSdp) {
  const roomData = {
    host: {
      name: hostData.name,
      charKey: hostData.charKey,
      ready: false,
      hp: 100,
      x: 100,
      y: 400
    },
    guest: null,
    status: 'waiting',
    createdAt: Date.now(),
    offer: offerSdp
  };
  
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  });
  
  return response.ok;
}

// Get arena room data
export async function getArenaRoom(roomId) {
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`);
  return response.json();
}

// Update arena room
export async function updateArenaRoom(roomId, updates) {
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
  return response.ok;
}

// Delete arena room
export async function deleteArenaRoom(roomId) {
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'DELETE'
  });
  return response.ok;
}

// Get all waiting rooms
export async function getWaitingRooms() {
  try {
    const response = await fetch(`${FIREBASE_URL}/arena.json`);
    const data = await response.json();
    
    if (!data) return [];
    
    // Filter only waiting rooms
    return Object.entries(data)
      .filter(([id, room]) => room && room.status === 'waiting' && room.host)
      .map(([id, room]) => ({ id, ...room }));
  } catch (err) {
    console.error('Failed to load arena rooms:', err);
    return [];
  }
}

// Join arena room as guest
export async function joinAsGuest(roomId, guestData) {
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'PATCH',
    body: JSON.stringify({
      guest: {
        name: guestData.name,
        charKey: guestData.charKey,
        ready: false,
        hp: 100,
        x: 380,
        y: 400
      },
      status: 'matched'
    })
  });
  return response.ok;
}

// Update player state in room
export async function updatePlayerState(roomId, isHost, stateUpdates) {
  const playerKey = isHost ? 'host' : 'guest';
  const updates = {};
  
  for (const [key, value] of Object.entries(stateUpdates)) {
    updates[`${playerKey}/${key}`] = value;
  }
  
  const response = await fetch(`${FIREBASE_URL}/arena/${roomId}.json`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
  return response.ok;
}

// Set room status
export async function setRoomStatus(roomId, status) {
  return updateArenaRoom(roomId, { status });
}

// Store WebRTC answer
export async function storeAnswer(roomId, answerSdp) {
  return updateArenaRoom(roomId, { answer: answerSdp });
}

// Send ICE candidate
export async function sendIceCandidate(roomId, isHost, candidate) {
  const path = isHost ? 'hostCandidates' : 'guestCandidates';
  try {
    await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}.json`, {
      method: 'POST',
      body: JSON.stringify(candidate.toJSON())
    });
    return true;
  } catch (err) {
    console.error('Failed to send ICE candidate:', err);
    return false;
  }
}

// Get ICE candidates
export async function getIceCandidates(roomId, isHost) {
  const path = isHost ? 'guestCandidates' : 'hostCandidates';
  try {
    const response = await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}.json`);
    return response.json();
  } catch (err) {
    console.error('Failed to get ICE candidates:', err);
    return null;
  }
}

// Mark ICE candidate as added
export async function markCandidateAdded(roomId, isHost, candidateKey) {
  const path = isHost ? 'guestCandidates' : 'hostCandidates';
  try {
    await fetch(`${FIREBASE_URL}/arena/${roomId}/${path}/${candidateKey}/_added.json`, {
      method: 'PUT',
      body: JSON.stringify(true)
    });
    return true;
  } catch (err) {
    return false;
  }
}
