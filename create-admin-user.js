// Create admin user profile in Firestore
// This script uses the Firebase Web SDK with emulator-style admin access

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyCT9CEe97G48yJxg3zK5AtO13b2qB3rXYc",
  authDomain: "traditions-c1cf5.firebaseapp.com",
  projectId: "traditions-c1cf5",
  storageBucket: "traditions-c1cf5.firebasestorage.app",
  messagingSenderId: "531794024182",
  appId: "1:531794024182:web:5e4043e03c1845b8e87ed7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function createAdminProfile() {
  try {
    // Sign in as the user to get the UID
    const email = 'gm11788@gmail.com';
    const password = process.argv[2];  // Pass password as command line arg
    
    if (!password) {
      console.log('Usage: node create-admin-user.js <password>');
      process.exit(1);
    }
    
    console.log('Signing in as', email);
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    console.log('User UID:', uid);
    
    // Create user profile
    console.log('Creating user profile...');
    await setDoc(doc(db, 'users', uid), {
      email: email,
      role: 'admin',
      companyName: 'Traditions Admin',
      licenseNumber: 'ADMIN-001',
      approved: true,
      createdAt: serverTimestamp()
    });
    
    console.log('✅ User profile created successfully!');
    console.log('You can now log in and access the platform.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdminProfile();
