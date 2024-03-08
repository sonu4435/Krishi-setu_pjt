// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.VITE_FIREBASE_STORAGE_BUCTET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGEING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_API_ID,
  measurementId: import.meta.env.VITE_MEASURE_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage()

  //

const auth = getAuth();

const provider = new GoogleAuthProvider();

const gitProvider = new GithubAuthProvider();

export { app, auth, provider, gitProvider };
