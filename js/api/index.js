// ===== API MODULES INDEX =====
// Tüm API modüllerinin merkezi export noktası

export {
  FIREBASE_URL,
  SERVER_URL,
  getGameSessionToken,
  setGameSessionToken,
  clearGameSessionToken,
  getLastScoreUpdate,
  setLastScoreUpdate,
  registerUser,
  loginUser,
  loadUserData,
  saveUserData,
  startGameSession,
  updateGameScore,
  endGameSession,
  fetchLeaderboard,
  loadArenaRooms,
  createArenaRoom,
  getArenaRoom,
  updateArenaRoom,
  postArenaData,
  deleteArenaRoom,
  sendIceCandidate,
  getIceCandidates,
  markCandidateAdded
} from './api.js';
