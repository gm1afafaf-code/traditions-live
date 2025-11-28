import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCT9CEe97G48yJxg3zK5AtO13b2qB3rXYc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'traditions-c1cf5.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'traditions-c1cf5',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'traditions-c1cf5.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '531794024182',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:531794024182:web:5e4043e03c1845b8e87ed7',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-28XH3SCRYJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('🔧 Firebase Emulators connected');
}

export default app;
