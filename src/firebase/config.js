// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNWwlL7v1rVswtoy5XmOGpL5sDOsnfSZA",
  authDomain: "likhain-a21f2.firebaseapp.com",
  databaseURL: "https://likhain-a21f2-default-rtdb.firebaseio.com",
  projectId: "likhain-a21f2",
  storageBucket: "likhain-a21f2.firebasestorage.app",
  messagingSenderId: "934412297345",
  appId: "1:934412297345:web:fb675267382b4cda435980",
  measurementId: "G-3K9MB20KF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app); // Realtime Database
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
