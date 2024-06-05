import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYX2mw4knyhcp4pQ1PAGQ5rqsTqMwILG0",
  authDomain: "certificadora-3.firebaseapp.com",
  projectId: "certificadora-3",
  storageBucket: "certificadora-3.appspot.com",
  messagingSenderId: "52748431403",
  appId: "1:52748431403:web:74b2e7e911d8067be77a6e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
