import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Firebase Web Config (public keys)
// Provided by user; safe to keep on client
const firebaseConfig = {
  apiKey: 'AIzaSyBsxSw34raOrSyLQfsA8DFU-ilznXj-T2k',
  authDomain: 'spot-q.firebaseapp.com',
  projectId: 'spot-q',
  storageBucket: 'spot-q.firebasestorage.app',
  messagingSenderId: '922687448214',
  appId: '1:922687448214:web:76c0a639f9f0f8cdc40eb7',
  measurementId: 'G-150DCJ77CY'
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


