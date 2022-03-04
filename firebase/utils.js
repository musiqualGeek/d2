import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCK4xQZf6B0HZvnZ8tjvfexZNTSkEjeXJM",
  authDomain: "d2app-aa2d2.firebaseapp.com",
  projectId: "d2app-aa2d2",
  storageBucket: "d2app-aa2d2.appspot.com",
  messagingSenderId: "850654856714",
  appId: "1:850654856714:web:ad0a81a77533842e2581f3",
  measurementId: "G-LNS8J7LZDK",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const app = getApp();
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { app, auth, db, storage };
