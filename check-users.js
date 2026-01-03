const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app'
  });
}

const db = admin.database();

async function check() {
  const snapshot = await db.ref('users').once('value');
  console.log(JSON.stringify(snapshot.val(), null, 2));
  process.exit(0);
}
check();
