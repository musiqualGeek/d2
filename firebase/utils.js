import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDhbEONc2pMcZEeAmS-huLiJfCRPlP9C-E",
  authDomain: "video-com-75ad3.firebaseapp.com",
  projectId: "video-com-75ad3",
  storageBucket: "video-com-75ad3.appspot.com",
  messagingSenderId: "516845873622",
  appId: "1:516845873622:web:1edfd857da1f127c085c77",
  measurementId: "G-3JSZ2890WE"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const app = getApp();
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export { app, auth, db, storage };
