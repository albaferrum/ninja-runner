// ===== NINJA RUNNER - MAIN ENTRY POINT =====
// ES6 modül yapısı için giriş noktası

// ===== DATA IMPORTS =====
import { CHARACTERS, getCharacterList, getCharacter } from './data/index.js';
import { LOCATIONS, getLocationList, getLocation } from './data/index.js';
import { SPECIAL_ITEMS, DOJO_ITEMS, getSpecialItem, getDojoItem } from './data/index.js';
import { BOSS, BOSS_MAXDOWN, BOSS_TYPES, getBoss } from './data/index.js';

// ===== STATE IMPORTS =====
import { 
  G, P, arenaState, permBonuses,
  setSelectedChar, setSelectedLocation, setNickname, setCurrentUser,
  resetGameState, resetPlayerState, resetArenaState
} from './state/index.js';

// ===== API IMPORTS =====
import {
  FIREBASE_URL, SERVER_URL,
  getGameSessionToken, setGameSessionToken, clearGameSessionToken,
  registerUser, loginUser, loadUserData, saveUserData,
  startGameSession, updateGameScore, endGameSession, fetchLeaderboard,
  loadArenaRooms, createArenaRoom, getArenaRoom, updateArenaRoom
} from './api/index.js';

// ===== UTILS IMPORTS =====
import {
  clamp, rand, lerp, randInt,
  rectIntersect, circleRectIntersect,
  createParticle, createExplosion,
  getStoredUser, setStoredUser, clearStoredUser,
  generateRoomCode, formatScore
} from './utils/index.js';

import { drawCharacterAvatar, generateAllAvatars } from './utils/index.js';

// ===== SYSTEMS IMPORTS =====
import {
  arenaKeys,
  setGameInputCallbacks, setArenaInputCallbacks,
  initInputSystem, initTouchControls
} from './systems/index.js';

// ===== ENTITIES IMPORTS =====
import {
  jump, crouch, airDash, playerRect, updatePlayer,
  spawnObstacle, obstacleRect, rectsOverlap, updateObstacles, clearObstacles,
  spawnPlatform, updatePlatforms, checkPlatformCollision,
  SCROLL_TYPES, spawnScroll, updateScrolls, collectScroll
} from './entities/index.js';

// ===== GAME IMPORTS =====
import {
  useSkillX, useSkillF, updateSkillCooldowns, endUltimate,
  useItem, updateItemEffects, updatePuppet,
  updateProjectiles, checkProjectileCollisions, updateParticles
} from './game/index.js';

// ===== SCREENS IMPORTS =====
import {
  initNavigation, showScreen, getActiveScreen,
  currentUser, nickname, setCurrentUser, getSavedUser, loadUserData as loadUserDataScreen,
  registerUser as registerUserScreen, loginUser as loginUserScreen, logoutUser, isLoggedIn,
  setLeaderboardReturnTo, getLeaderboardReturnTo, formatLeaderboardHTML, getPlayerRank, loadLeaderboard,
  DOJO_PRICES, canAffordDojoItem, ownsDojoItem, purchaseDojoItem, getDojoItemStatus
} from './screens/index.js';

// ===== ARENA IMPORTS =====
import {
  rtcConfig, ARENA_WORLD_W, ARENA_WORLD_H, ARENA_GROUND_Y, ARENA_GRAVITY, ARENA_MAX_HP,
  ARENA_MATCH_TIME, ARENA_READY_COUNTDOWN,
  generateRoomCode as generateArenaRoomCode, createPeerConnection, setupDataChannel, cleanupWebRTC, sendToPeer,
  createArenaRoom as createArenaRoomFirebase, getArenaRoom as getArenaRoomFirebase, updateArenaRoom as updateArenaRoomFirebase,
  deleteArenaRoom, getWaitingRooms, joinAsGuest, updatePlayerState, setRoomStatus, storeAnswer,
  sendIceCandidate, getIceCandidates, markCandidateAdded
} from './arena/index.js';

// ===== GLOBAL EXPORTS =====
// Bu değişkenleri window'a ekle ki eski kod da erişebilsin
window.CHARACTERS = CHARACTERS;
window.LOCATIONS = LOCATIONS;
window.SPECIAL_ITEMS = SPECIAL_ITEMS;
window.DOJO_ITEMS = DOJO_ITEMS;
window.BOSS = BOSS;
window.BOSS_MAXDOWN = BOSS_MAXDOWN;
window.G = G;
window.P = P;
window.arenaState = arenaState;
window.permBonuses = permBonuses;
window.clamp = clamp;
window.rand = rand;
window.FIREBASE_URL = FIREBASE_URL;
window.SERVER_URL = SERVER_URL;
window.drawCharacterAvatar = drawCharacterAvatar;
window.generateAllAvatars = generateAllAvatars;
window.arenaKeys = arenaKeys;
window.SCROLL_TYPES = SCROLL_TYPES;

// Entity functions
window.jump = jump;
window.crouch = crouch;
window.airDash = airDash;
window.playerRect = playerRect;
window.spawnObstacle = spawnObstacle;
window.obstacleRect = obstacleRect;
window.rectsOverlap = rectsOverlap;
window.spawnPlatform = spawnPlatform;
window.spawnScroll = spawnScroll;

// Game functions
window.useSkillX = useSkillX;
window.useSkillF = useSkillF;
window.useItem = useItem;
window.updateProjectiles = updateProjectiles;
window.updateParticles = updateParticles;

// Screens functions
window.initNavigation = initNavigation;
window.showScreen = showScreen;
window.getActiveScreen = getActiveScreen;
window.loadLeaderboard = loadLeaderboard;
window.formatLeaderboardHTML = formatLeaderboardHTML;
window.getPlayerRank = getPlayerRank;
window.purchaseDojoItem = purchaseDojoItem;
window.getDojoItemStatus = getDojoItemStatus;
window.DOJO_PRICES = DOJO_PRICES;

// Arena functions
window.rtcConfig = rtcConfig;
window.ARENA_WORLD_W = ARENA_WORLD_W;
window.ARENA_WORLD_H = ARENA_WORLD_H;
window.ARENA_GROUND_Y = ARENA_GROUND_Y;
window.ARENA_GRAVITY = ARENA_GRAVITY;
window.ARENA_MAX_HP = ARENA_MAX_HP;
window.generateArenaRoomCode = generateArenaRoomCode;
window.createPeerConnection = createPeerConnection;
window.setupDataChannel = setupDataChannel;
window.cleanupWebRTC = cleanupWebRTC;
window.sendToPeer = sendToPeer;
window.getWaitingRooms = getWaitingRooms;
window.joinAsGuest = joinAsGuest;

// ===== INITIALIZATION =====
console.log('🎮 Ninja Runner modüler yapı yüklendi');
console.log(`📦 ${Object.keys(CHARACTERS).length} karakter yüklendi`);
console.log(`🗺️ ${Object.keys(LOCATIONS).length} lokasyon yüklendi`);
console.log(`🎁 ${SPECIAL_ITEMS.length} özel eşya yüklendi`);
console.log(`🎯 Entities modülleri yüklendi`);
console.log(`⚔️ Game modülleri yüklendi`);
console.log(`📱 Screens modülleri yüklendi`);
console.log(`🏟️ Arena modülleri yüklendi`);

// Modül hazır olduğunda event gönder
window.dispatchEvent(new CustomEvent('modulesReady', {
  detail: {
    CHARACTERS,
    LOCATIONS,
    SPECIAL_ITEMS,
    DOJO_ITEMS,
    BOSS,
    BOSS_MAXDOWN,
    G, P, arenaState, permBonuses,
    utils: { clamp, rand, lerp, randInt, rectIntersect, createParticle, createExplosion },
    entities: { jump, crouch, airDash, spawnObstacle, spawnPlatform, spawnScroll },
    game: { useSkillX, useSkillF, useItem },
    screens: { showScreen, loadLeaderboard, purchaseDojoItem },
    arena: { createPeerConnection, setupDataChannel, cleanupWebRTC, sendToPeer, getWaitingRooms }
  }
}));
