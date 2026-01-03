// ===== ARENA CONFIG MODULE =====
// Arena WebRTC ve temel konfigürasyon

// WebRTC Configuration
export const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

// Arena constants
export const ARENA_WORLD_W = 480;
export const ARENA_WORLD_H = 400;
export const ARENA_GROUND_Y = 350;
export const ARENA_GRAVITY = 0.6;
export const ARENA_MAX_HP = 100;

// Match settings
export const ARENA_MATCH_TIME = 90; // seconds
export const ARENA_READY_COUNTDOWN = 3; // seconds

// Generate random room code
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Create WebRTC peer connection
export function createPeerConnection(onIceCandidate, onConnectionStateChange) {
  const pc = new RTCPeerConnection(rtcConfig);
  
  pc.onicecandidate = onIceCandidate;
  pc.onconnectionstatechange = onConnectionStateChange;

  return pc;
}

// Setup data channel
export function setupDataChannel(channel, callbacks) {
  const { onOpen, onClose, onMessage } = callbacks;
  
  channel.onopen = () => {
    console.log('📡 DataChannel açıldı - P2P aktif!');
    if (onOpen) onOpen();
  };

  channel.onclose = () => {
    console.log('DataChannel kapandı');
    if (onClose) onClose();
  };

  channel.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error('Failed to parse peer message:', err);
    }
  };

  return channel;
}

// Clean up WebRTC resources
export function cleanupWebRTC(arenaState) {
  if (arenaState.dataChannel) {
    arenaState.dataChannel.close();
    arenaState.dataChannel = null;
  }
  if (arenaState.peerConnection) {
    arenaState.peerConnection.close();
    arenaState.peerConnection = null;
  }
  arenaState.isConnected = false;
}

// Send data to peer via data channel
export function sendToPeer(dataChannel, data) {
  if (dataChannel && dataChannel.readyState === 'open') {
    dataChannel.send(JSON.stringify(data));
    return true;
  }
  return false;
}
