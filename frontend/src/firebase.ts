import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Our web app's Firebase configuration (example)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API,
    authDomain: "cornellguessr-96637.firebaseapp.com",
    projectId: "cornellguessr-96637",
    storageBucket: "cornellguessr-96637.firebasestorage.app",
    messagingSenderId: "214428066482",
    appId: "1:214428066482:web:8f742845328f1c7fc69fab",
    measurementId: "G-KQSDL3E5NE"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export const auth = getAuth();
