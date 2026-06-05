import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3bsjK29_0OYPZ80cVu3JHzLXMaBeBA_U",
  authDomain: "collabsphere2.firebaseapp.com",
  projectId: "collabsphere2",
  storageBucket: "collabsphere2.firebasestorage.app",
  messagingSenderId: "584815422891",
  appId: "1:584815422891:web:dafca451b85dd06eb3b6ee",
  measurementId: "G-3PL6T6VQFB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, db, EmailAuthProvider, linkWithCredential };
