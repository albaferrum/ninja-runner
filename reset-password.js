const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ninja-runner-694e8-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = admin.database();

async function resetPasswordForUser(username, newPassword) {
  try {
    // usernames tablosundan email'i bul
    const snapshot = await db.ref(`usernames/${username}`).once('value');
    
    if (!snapshot.exists()) {
      console.log(`Username '${username}' not found in database`);
      
      // Tüm kullanıcıları listele
      console.log('\nListing all usernames:');
      const allUsernames = await db.ref('usernames').once('value');
      allUsernames.forEach(child => {
        console.log(`  - ${child.key}: ${child.val()}`);
      });
      return;
    }
    
    const email = snapshot.val();
    console.log(`Found email for ${username}: ${email}`);
    
    // Firebase Auth'dan kullanıcıyı bul
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user in Auth: ${user.uid}`);
    
    // Şifreyi güncelle
    await admin.auth().updateUser(user.uid, { password: newPassword });
    console.log(`Password updated successfully for ${username}!`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  process.exit(0);
}

resetPasswordForUser('susu', '102030');
