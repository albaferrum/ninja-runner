const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app'
  });
}

const db = admin.database();

async function update() {
  // Cem's Firebase Auth UID
  const cemUID = '59oGHzxyVBPKP89BIjFVhZ1S6pF3';
  
  await db.ref('users/' + cemUID + '/coins').set(100000);
  console.log('Cem coins = 100000 olarak güncellendi!');
  
  // Verify
  const snapshot = await db.ref('users/' + cemUID).once('value');
  console.log(snapshot.val());
  
  process.exit(0);
}
update();
