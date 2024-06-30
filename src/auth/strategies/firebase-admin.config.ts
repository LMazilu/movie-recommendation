import * as admin from 'firebase-admin';
import * as serviceAccount from '../secret/firebase-secret.json';

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
