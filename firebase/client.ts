import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCTcZnd3LAVHvLJqKbAL6XAGu3gmsDu824",
  authDomain: "prepwise-f6bef.firebaseapp.com",
  projectId: "prepwise-f6bef",
  storageBucket: "prepwise-f6bef.firebasestorage.app",
  messagingSenderId: "884985865888",
  appId: "1:884985865888:web:f07972bce7948641134bc5",
  measurementId: "G-2ZRQ3K2D3L"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};