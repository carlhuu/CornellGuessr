import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

console.log("FIREBASE KEY:", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cornellguessr-ba50b.firebaseapp.com",
  projectId: "cornellguessr-ba50b",
  storageBucket: "cornellguessr-ba50b.appspot.com",
  messagingSenderId: "951128114371",
  appId: "1:951128114371:web:ba24d04dafaa0162b6ce76",
  measurementId: "G-QRPV9Q9B6J",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
