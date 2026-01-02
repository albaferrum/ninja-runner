const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SCORES_FILE = path.join(__dirname, 'scores.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize scores file if it doesn't exist
if (!fs.existsSync(SCORES_FILE)) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify([], null, 2));
}

// Get all scores (sorted by score descending)
app.get('/api/scores', (req, res) => {
  try {
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    // Sort by score descending and return top 50
    const sortedScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    res.json(sortedScores);
  } catch (error) {
    console.error('Error reading scores:', error);
    res.status(500).json({ error: 'Failed to read scores' });
  }
});

// Add a new score
app.post('/api/scores', (req, res) => {
  try {
    const { nickname, score, character, location } = req.body;
    
    if (!nickname || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid data' });
    }
    
    const scores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    
    // Check if player already has a score
    const existingIndex = scores.findIndex(s => s.nickname.toLowerCase() === nickname.toLowerCase());
    
    const newEntry = {
      nickname: nickname.slice(0, 16),
      score: Math.floor(score),
      character: character || 'unknown',
      location: location || 'dark',
      date: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
      // Update only if new score is higher
      if (score > scores[existingIndex].score) {
        scores[existingIndex] = newEntry;
        fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
        res.json({ message: 'High score updated!', isNewHighScore: true, entry: newEntry });
      } else {
        res.json({ message: 'Score recorded', isNewHighScore: false, entry: scores[existingIndex] });
      }
    } else {
      // Add new entry
      scores.push(newEntry);
      fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
      res.json({ message: 'Score added!', isNewHighScore: true, entry: newEntry });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
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
