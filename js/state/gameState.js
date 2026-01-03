// ===== GAME STATE =====
// Ana oyun durumu (G) ve oyuncu durumu (P) tanımları

// ===== GAME STATE (G) =====
export const G = {
  t: 0, dt: 0, last: 0,
  running: false, gameOver: false,

  score: 0,
  speed: 280,
  speedMax: 600,
  speedAccel: 12,
  gravity: 2400,

  groundY: 520,
  groundScroll: 0,

  spawnTimer: 0,
  spawnMin: 0.70,
  spawnMax: 1.20,

  obstacles: [],
  projectiles: [],
  particles: [],
  clouds: [],

  skillXCooldown: 0,
  skillFCooldown: 0,
  ultActive: false,
  ultTimer: 0,
  ultType: null,

  // Eagle flight state
  eagleY: 0,
  eagleTargetY: 0,
  eagleWingPhase: 0,

  // Monkey friend state
  monkeyRect: null,

  // Boss state
  bossActive: false,
  riaru1Defeated: false,
  maxdownDefeated: false,
  currentBossType: null, // 'riaru' or 'maxdown'
  boss: null,
  bossProjectiles: [],
  bossAttackTimer: 0,
  bossUltiTimer: 0,
  bossUltiActive: false,
  lightningStrikes: [],
  laserActive: false,
  laserTimer: 0,
  laserY: 0,

  // Parchment/Scroll system
  scrolls: [],
  scrollSpawnTimer: 0,
  lives: 1,
  maxLives: 3,
  scoreMultiplier: 1,
  scoreMultiplierTimer: 0,
  ultiDurationMultiplier: 1,

  // Platform system
  platforms: [],
  platformSpawnTimer: 0,
  onPlatform: null, // Currently standing platform

  // Coin & Item system
  coins: 0,
  ownedItems: [], // Purchased items
  itemSlots: [null, null, null], // 3 item slots
  activeItem: null, // Currently active item effect
  activeItemTimer: 0,
  itemCooldowns: [0, 0, 0], // Cooldowns for each slot

  // Puppet (slave character) state
  puppet: null, // { charKey, x, y, hp }

  scaleX: 1,
  scaleY: 1
};

// ===== PLAYER STATE (P) =====
export const P = {
  x: 100,
  y: 520,
  w: 40,
  h: 64,
  vy: 0,
  onGround: true,
  crouching: false,
  baseH: 64,
  crouchH: 36,
  jumpVel: -920
};

// ===== ARENA STATE =====
export const arenaState = {
  active: false,
  roomId: null,
  isHost: false,
  ready: false,
  opponentReady: false,
  countdown: 0,
  inMatch: false,
  listener: null, // Firebase listener reference

  // WebRTC
  peerConnection: null,
  dataChannel: null,
  isConnected: false,

  // Match state
  player: {
    x: 100,
    y: 400,
    hp: 100,
    maxHp: 100,
    vx: 0,
    vy: 0,
    facingRight: true,
    attacking: false,
    attackTimer: 0,
    skillXCooldown: 0,
    skillFCooldown: 0,
    stunned: 0,
    invincible: 0
  },
  opponent: {
    x: 380,
    y: 400,
    hp: 100,
    maxHp: 100,
    charKey: null,
    name: '',
    facingRight: false
  },
  projectiles: [],
  particles: [],
  lastUpdate: 0,
  countdownStarted: false
};

// ===== PERSISTENT BONUSES =====
export const permBonuses = {
  doubleJump: false,
  extraLives: 0,
  airDash: false
};

// ===== GAME SELECTIONS =====
export let selectedChar = null;
export let selectedLocation = null;
export let nickname = null;
export let currentUser = null;

// Selection setters
export function setSelectedChar(charKey) {
  selectedChar = charKey;
}

export function setSelectedLocation(locKey) {
  selectedLocation = locKey;
}

export function setNickname(name) {
  nickname = name;
}

export function setCurrentUser(user) {
  currentUser = user;
}

// ===== STATE RESET FUNCTIONS =====
export function resetGameState() {
  G.t = 0;
  G.dt = 0;
  G.last = 0;
  G.running = false;
  G.gameOver = false;
  G.score = 0;
  G.speed = 280;
  G.groundScroll = 0;
  G.spawnTimer = 0;
  G.obstacles = [];
  G.projectiles = [];
  G.particles = [];
  G.clouds = [];
  G.skillXCooldown = 0;
  G.skillFCooldown = 0;
  G.ultActive = false;
  G.ultTimer = 0;
  G.ultType = null;
  G.eagleY = 0;
  G.eagleTargetY = 0;
  G.eagleWingPhase = 0;
  G.monkeyRect = null;
  G.bossActive = false;
  G.currentBossType = null;
  G.boss = null;
  G.bossProjectiles = [];
  G.bossAttackTimer = 0;
  G.bossUltiTimer = 0;
  G.bossUltiActive = false;
  G.lightningStrikes = [];
  G.laserActive = false;
  G.laserTimer = 0;
  G.laserY = 0;
  G.scrolls = [];
  G.scrollSpawnTimer = 0;
  G.lives = 1 + permBonuses.extraLives;
  G.maxLives = 3 + permBonuses.extraLives;
  G.scoreMultiplier = 1;
  G.scoreMultiplierTimer = 0;
  G.ultiDurationMultiplier = 1;
  G.platforms = [];
  G.platformSpawnTimer = 0;
  G.onPlatform = null;
  G.ownedItems = [];
  G.itemSlots = [null, null, null];
  G.activeItem = null;
  G.activeItemTimer = 0;
  G.itemCooldowns = [0, 0, 0];
  G.puppet = null;
}

export function resetPlayerState() {
  P.x = 100;
  P.y = G.groundY;
  P.vy = 0;
  P.onGround = true;
  P.crouching = false;
  P.h = P.baseH;
}

export function resetArenaState() {
  arenaState.active = false;
  arenaState.roomId = null;
  arenaState.isHost = false;
  arenaState.ready = false;
  arenaState.opponentReady = false;
  arenaState.countdown = 0;
  arenaState.inMatch = false;
  arenaState.listener = null;
  arenaState.peerConnection = null;
  arenaState.dataChannel = null;
  arenaState.isConnected = false;
  arenaState.player.x = 100;
  arenaState.player.y = 400;
  arenaState.player.hp = 100;
  arenaState.player.vx = 0;
  arenaState.player.vy = 0;
  arenaState.player.facingRight = true;
  arenaState.player.attacking = false;
  arenaState.player.attackTimer = 0;
  arenaState.player.skillXCooldown = 0;
  arenaState.player.skillFCooldown = 0;
  arenaState.player.stunned = 0;
  arenaState.player.invincible = 0;
  arenaState.opponent.x = 380;
  arenaState.opponent.y = 400;
  arenaState.opponent.hp = 100;
  arenaState.opponent.charKey = null;
  arenaState.opponent.name = '';
  arenaState.opponent.facingRight = false;
  arenaState.projectiles = [];
  arenaState.particles = [];
  arenaState.lastUpdate = 0;
  arenaState.countdownStarted = false;
}
