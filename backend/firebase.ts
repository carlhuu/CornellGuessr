import admin from "firebase-admin";
import serviceAccountJson from "./serviceAccountKey.json";

const serviceAccount = serviceAccountJson as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export { db };