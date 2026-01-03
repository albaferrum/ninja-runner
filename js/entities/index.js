// ===== ENTITIES MODULES INDEX =====
// Tüm entity modüllerinin merkezi export noktası

export {
  jump,
  crouch,
  airDash,
  playerRect,
  updatePlayer
} from './player.js';

export {
  spawnObstacle,
  obstacleRect,
  rectsOverlap,
  updateObstacles,
  clearObstacles
} from './obstacles.js';

export {
  spawnPlatform,
  updatePlatforms,
  checkPlatformCollision
} from './platforms.js';

export {
  SCROLL_TYPES,
  spawnScroll,
  updateScrolls,
  collectScroll
} from './scrolls.js';
