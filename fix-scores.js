const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = admin.database();

async function fixScores() {
  // Get all scores
  const snapshot = await db.ref('scores').once('value');
  const scores = snapshot.val() || {};
  
  console.log('Mevcut skorlar:');
  Object.keys(scores).forEach(key => {
    console.log(key + ': ' + scores[key].nickname + ' - ' + scores[key].score);
  });
  
  // Get all auth users
  const listResult = await admin.auth().listUsers();
  const uidToNickname = {};
  listResult.users.forEach(u => {
    if (u.displayName) {
      uidToNickname[u.uid] = u.displayName;
    }
  });
  
  // Keep only highest score per nickname (case-insensitive)
  const bestScores = {};
  Object.keys(scores).forEach(key => {
    const s = scores[key];
    const nickLower = s.nickname.toLowerCase();
    if (!bestScores[nickLower] || s.score > bestScores[nickLower].score) {
      bestScores[nickLower] = { nickname: s.nickname, score: s.score };
    }
  });
  
  console.log('\nTemizlenmiş skorlar:');
  const cleanScores = {};
  Object.entries(bestScores).forEach(([nickLower, s]) => {
    // Find UID for this nickname
    let uid = null;
    for (const [u, n] of Object.entries(uidToNickname)) {
      if (n.toLowerCase() === nickLower) {
        uid = u;
        break;
      }
    }
    const finalKey = uid || 'legacy_' + nickLower.replace(/[.#$\[\]]/g, '_');
    cleanScores[finalKey] = { nickname: s.nickname, score: s.score };
    console.log(finalKey + ': ' + s.nickname + ' - ' + s.score);
  });
  
  // Replace scores
  await db.ref('scores').set(cleanScores);
  console.log('\n✅ Skorlar temizlendi!');
  process.exit(0);
}

fixScores();
