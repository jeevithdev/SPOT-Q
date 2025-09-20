import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Firebase Web Config (public keys)
// Provided by user; safe to keep on client
const firebaseConfig = {
  apiKey: "AIzaSyBPu2Bv4BJDLv5KO9eDs7szNe3UwRXBJpE",
  authDomain: "spot-q-45cd9.firebaseapp.com",
  projectId: "spot-q-45cd9",
  storageBucket: "spot-q-45cd9.firebasestorage.app",
  messagingSenderId: "42392180261",
  appId: "1:42392180261:web:a95c71daeb678c867191cc",
  measurementId: "G-SYMMY9R2Z5"
};

const app = initializeApp(firebaseConfig);

let analytics;
analyticsSupported().then((ok) => {
  if (ok) {
    analytics = getAnalytics(app);
  }
});

const auth = getAuth(app);

export { app, analytics, auth, RecaptchaVerifier, signInWithPhoneNumber };


