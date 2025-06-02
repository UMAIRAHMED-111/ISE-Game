import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASzenX5O1_z-W0agV7o8kx5sZjsyie31E",
  authDomain: "hello-832d0.firebaseapp.com",
  projectId: "hello-832d0",
  storageBucket: "hello-832d0.firebasestorage.app",
  messagingSenderId: "101508943204",
  appId: "1:101508943204:web:ccca38a4e067fda8bb7e71",
  measurementId: "G-1WHXG3VZHY"
};

console.log('Initializing Firebase for InfoSec Project...');

let app;
let auth;
let db;
let analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully for InfoSec Project');

  // Initialize Firebase services
  auth = getAuth(app);
  console.log('Firebase auth initialized successfully');
  
  db = getFirestore(app);
  console.log('Firebase Firestore initialized successfully');

  // Initialize Analytics
  analytics = getAnalytics(app);
  console.log('Firebase Analytics initialized successfully');

  // Enable offline persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Firestore persistence enabled for InfoSec Project');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      }
    });

} catch (error) {
  console.error('Error initializing Firebase for InfoSec Project:', error);
  throw error;
}

export { auth, db, analytics };
export default app; 