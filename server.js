const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SCORES_FILE = path.join(__dirname, 'scores.json');

// Firebase URL (keep this secret - only server uses it)
const FIREBASE_URL = 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app';

// Game sessions for anti-cheat
const gameSessions = new Map();
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== ANTI-CHEAT: Game Session Management =====

// Start a game session - client must call this when game starts
app.post('/api/game/start', (req, res) => {
  try {
    const { username, character, location } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }
    
    // Generate unique session token
    const sessionId = crypto.randomBytes(16).toString('hex');
    const sessionToken = crypto.createHmac('sha256', SESSION_SECRET)
      .update(sessionId + username + Date.now())
      .digest('hex');
    
    // Store session
    gameSessions.set(sessionToken, {
      username,
      character: character || 'ringo',
      location: location || 'forest',
      startTime: Date.now(),
      lastUpdate: Date.now(),
      score: 0,
      maxScoreRate: 50, // Max score per second (anti-cheat)
      reported: false
    });
    
    // Clean old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    for (const [token, session] of gameSessions) {
      if (session.startTime < oneHourAgo) {
        gameSessions.delete(token);
      }
    }
    
    res.json({ sessionToken, message: 'Game started' });
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Update score during game (for validation)
app.post('/api/game/update', (req, res) => {
  try {
    const { sessionToken, score } = req.body;
    
    const session = gameSessions.get(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    const now = Date.now();
    const timeSinceStart = (now - session.startTime) / 1000; // seconds
    const timeSinceLastUpdate = (now - session.lastUpdate) / 1000;
    
    // Anti-cheat: Check if score increase is reasonable
    const scoreIncrease = score - session.score;
    const maxPossibleIncrease = timeSinceLastUpdate * session.maxScoreRate;
    
    if (scoreIncrease > maxPossibleIncrease * 1.5) { // Allow 50% tolerance
      session.reported = true;
      console.log(`⚠️ Suspicious score: ${session.username} - +${scoreIncrease} in ${timeSinceLastUpdate}s`);
    }
    
    session.score = score;
    session.lastUpdate = now;
    
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// End game and submit score
app.post('/api/game/end', async (req, res) => {
  try {
    const { sessionToken, finalScore } = req.body;
    
    const session = gameSessions.get(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    const gameDuration = (Date.now() - session.startTime) / 1000; // seconds
    
    // Anti-cheat validations
    const warnings = [];
    
    // 1. Game too short for this score
    const minTimeForScore = finalScore / 100; // At least 1 second per 100 points
    if (gameDuration < minTimeForScore) {
      warnings.push(`Game too short: ${gameDuration.toFixed(1)}s for ${finalScore} points`);
    }
    
    // 2. Score rate too high
    const scoreRate = finalScore / gameDuration;
    if (scoreRate > 60) { // More than 60 points per second is suspicious
      warnings.push(`Score rate too high: ${scoreRate.toFixed(1)}/s`);
    }
    
    // 3. Previous suspicious activity
    if (session.reported) {
      warnings.push('Suspicious activity during game');
    }
    
    // 4. Score doesn't match updates
    if (Math.abs(finalScore - session.score) > 500) {
      warnings.push(`Score mismatch: reported ${session.score}, final ${finalScore}`);
    }
    
    // If too many warnings, reject
    if (warnings.length >= 2) {
      console.log(`🚫 Score rejected for ${session.username}: ${warnings.join(', ')}`);
      gameSessions.delete(sessionToken);
      return res.status(403).json({ 
        error: 'Score rejected - suspicious activity detected',
        warnings 
      });
    }
    
    // Apply penalty for 1 warning
    let adjustedScore = finalScore;
    if (warnings.length === 1) {
      adjustedScore = Math.floor(finalScore * 0.8);
      console.log(`⚠️ Score adjusted for ${session.username}: ${finalScore} -> ${adjustedScore}`);
    }
    
    // Save to local scores.json
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    const existingIndex = scores.findIndex(s => s.nickname.toLowerCase() === session.username.toLowerCase());
    
    const newEntry = {
      nickname: session.username,
      score: adjustedScore,
      character: session.character,
      location: session.location,
      date: new Date().toISOString(),
      duration: Math.floor(gameDuration)
    };
    
    let isNewHighScore = false;
    if (existingIndex !== -1) {
      if (adjustedScore > scores[existingIndex].score) {
        scores[existingIndex] = newEntry;
        isNewHighScore = true;
      }
    } else {
      scores.push(newEntry);
      isNewHighScore = true;
    }
    
    if (isNewHighScore) {
      fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
      
      // Also update Firebase (server-side only)
      try {
        const fetch = (await import('node-fetch')).default;
        await fetch(`${FIREBASE_URL}/leaderboard/${session.username.toLowerCase()}.json`, {
          method: 'PUT',
          body: JSON.stringify(newEntry)
        });
      } catch (fbError) {
        console.log('Firebase update failed (optional):', fbError.message);
      }
    }
    
    // Clean up session
    gameSessions.delete(sessionToken);
    
    res.json({ 
      message: isNewHighScore ? 'New high score!' : 'Score recorded',
      score: adjustedScore,
      isNewHighScore,
      warnings: warnings.length > 0 ? warnings : undefined
    });
    
  } catch (error) {
    console.error('Error ending game:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Initialize scores file if it doesn't exist
if (!fs.existsSync(SCORES_FILE)) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify([], null, 2));
}

// Sync scores from Firebase on startup
async function syncFromFirebase() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${FIREBASE_URL}/scores.json`);
    const data = await response.json();
    
    if (data) {
      const scores = Object.values(data);
      fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
      console.log(`📥 Synced ${scores.length} scores from Firebase`);
    }
  } catch (error) {
    console.log('⚠️ Could not sync from Firebase:', error.message);
  }
}
syncFromFirebase();

// Get all scores (sorted by score descending) - tries Firebase first, fallback to local
app.get('/api/scores', async (req, res) => {
  try {
    // Try Firebase first for most up-to-date data
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`${FIREBASE_URL}/scores.json`);
      const data = await response.json();
      
      if (data) {
        const scores = Object.values(data)
          .sort((a, b) => b.score - a.score)
          .slice(0, 50);
        return res.json(scores);
      }
    } catch (fbError) {
      console.log('Firebase read failed, using local file');
    }
    
    // Fallback to local file
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    const sortedScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    res.json(sortedScores);
  } catch (error) {
    console.error('Error reading scores:', error);
    res.status(500).json({ error: 'Failed to read scores' });
  }
});

// POST scores is DISABLED - must use secure /api/game/end
app.post('/api/scores', (req, res) => {
  console.log('🚫 Blocked direct score submission attempt');
  res.status(403).json({ 
    error: 'Direct score submission disabled. Nice try! 😎',
    hint: 'Scores can only be submitted through verified game sessions.'
  });
});

// Get player's best score
app.get('/api/scores/:nickname', (req, res) => {
  try {
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    const playerScore = scores.find(s => s.nickname.toLowerCase() === req.params.nickname.toLowerCase());
    
    if (playerScore) {
      // Get player's rank
      const sortedScores = scores.sort((a, b) => b.score - a.score);
      const rank = sortedScores.findIndex(s => s.nickname.toLowerCase() === req.params.nickname.toLowerCase()) + 1;
      res.json({ ...playerScore, rank });
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error reading score:', error);
    res.status(500).json({ error: 'Failed to read score' });
  }
});

// ===== USER AUTHENTICATION =====
const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Register new user
app.post('/api/register', (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tüm alanlar gerekli' });
    }

    if (username.length < 2 || username.length > 16) {
      return res.status(400).json({ error: 'Kullanıcı adı 2-16 karakter olmalı' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Şifre en az 4 karakter olmalı' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış' });
    }

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı' });
    }

    // Add new user
    const newUser = {
      username: username.slice(0, 16),
      email: email.toLowerCase(),
      password: password, // In production, hash this!
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.json({ message: 'Kayıt başarılı', username: newUser.username, email: newUser.email });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Kayıt işlemi başarısız' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    // Find user
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Şifre yanlış' });
    }

    res.json({ message: 'Giriş başarılı', username: user.username, email: user.email });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Giriş işlemi başarısız' });
  }
});

app.listen(PORT, () => {
  console.log(`🎮 Ninja Runner Leaderboard Server running at http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/scores          - Get top 50 scores`);
  console.log(`   POST /api/scores          - Submit a score`);
  console.log(`   GET  /api/scores/:nickname - Get player's best score`);
  console.log(`   POST /api/register        - Register new user`);
  console.log(`   POST /api/login           - Login user`);
  console.log(`\n🌐 Open http://localhost:${PORT} to play the game!`);
});
