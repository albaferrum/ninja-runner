// ===== LEADERBOARD MODULE =====
// Skor tablosu işlemleri

import { fetchLeaderboard } from '../api/api.js';
import { CHARACTERS } from '../data/characters.js';
import { escapeHtml } from '../utils/helpers.js';

// Return screen tracking
let leaderboardReturnTo = 'charSelect';

// Set return screen
export function setLeaderboardReturnTo(screen) {
  leaderboardReturnTo = screen;
}

// Get return screen
export function getLeaderboardReturnTo() {
  return leaderboardReturnTo;
}

// Format leaderboard HTML
export function formatLeaderboardHTML(scores, currentNickname) {
  if (!scores || scores.length === 0) {
    return '<div class="leaderboard-empty">Henüz skor yok. İlk sen ol!</div>';
  }
  
  return scores.map((s, i) => {
    const rank = i + 1;
    const isCurrentPlayer = s.nickname.toLowerCase() === currentNickname.toLowerCase();
    const rankClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : '';
    const charName = CHARACTERS[s.character]?.name || s.character;
    
    return `
      <div class="leaderboard-row ${rankClass} ${isCurrentPlayer ? 'current-player' : ''}">
        <span class="rank ${rankClass}">${rank <= 3 ? (rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉') : rank}</span>
        <span class="player-name">${escapeHtml(s.nickname)}</span>
        <span class="player-char">${charName}</span>
        <span class="player-score">${s.score.toLocaleString()}</span>
      </div>
    `;
  }).join('');
}

// Get player rank from scores
export function getPlayerRank(scores, nickname) {
  if (!scores || !nickname) return null;
  const playerIndex = scores.findIndex(s => s.nickname.toLowerCase() === nickname.toLowerCase());
  if (playerIndex === -1) return null;
  
  const rank = playerIndex + 1;
  const suffix = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
  return { rank, suffix, text: `Sıralaman: #${rank} ${suffix}` };
}

// Load and format leaderboard
export async function loadLeaderboard(nickname) {
  const scores = await fetchLeaderboard();
  const html = formatLeaderboardHTML(scores, nickname);
  const playerRank = getPlayerRank(scores, nickname);
  
  return {
    scores,
    html,
    playerRank
  };
}
