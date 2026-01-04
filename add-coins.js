const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = admin.database();
const uid = 'KE2HBtwf1KOJ73NSww49PUvGFBN2'; // susu's UID

db.ref('users/' + uid + '/coins').once('value').then(snapshot => {
  const currentCoins = snapshot.val() || 0;
  const newCoins = currentCoins + 1500;
  return db.ref('users/' + uid + '/coins').set(newCoins).then(() => {
    console.log('susu coins: ' + currentCoins + ' -> ' + newCoins + ' (+1500)');
    process.exit(0);
  });
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
