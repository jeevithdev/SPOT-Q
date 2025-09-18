const admin = require('firebase-admin');

let app;

const initFirebaseAdmin = () => {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin not configured: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    return null;
  }

  // Handle escaped newlines in env var
  privateKey = privateKey.replace(/\\n/g, '\n');

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  });

  return app;
};

const verifyFirebaseIdToken = async (idToken) => {
  const instance = initFirebaseAdmin();
  if (!instance) {
    const error = new Error('Firebase Admin not configured');
    error.code = 'FIREBASE_ADMIN_NOT_CONFIGURED';
    throw error;
  }
  const decoded = await admin.auth().verifyIdToken(idToken);
  return decoded;
};

module.exports = { initFirebaseAdmin, verifyFirebaseIdToken };


