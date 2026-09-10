
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-iq-20cb0.firebaseapp.com",
  projectId: "ai-interview-iq-20cb0",
  storageBucket: "ai-interview-iq-20cb0.firebasestorage.app",
  messagingSenderId: "954793501679",
  appId: "1:954793501679:web:07110b304d7fc51fe98c1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}