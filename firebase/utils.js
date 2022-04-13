import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// alliedTechnologies59

const firebaseConfig = {
  apiKey: "AIzaSyAZn3jhZ6hryQRJmD86aHUz-4PJ4sTi7u4",
  authDomain: "d2app-74e2c.firebaseapp.com",
  projectId: "d2app-74e2c",
  storageBucket: "d2app-74e2c.appspot.com",
  messagingSenderId: "524401658101",
  appId: "1:524401658101:web:b1c74674017055f7b0ddbc",
  measurementId: "G-HVEHZVSMT1"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const app = getApp();
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { app, auth, db, storage };
