// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "natalcare-hub.firebaseapp.com",
  projectId: "natalcare-hub",
  storageBucket: "natalcare-hub.appspot.com",
  messagingSenderId: "327055449389",
  appId: "1:327055449389:web:0d0fffadf2a631447cc7a4"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth()
const db = getFirestore(app);

export { app, auth, db }