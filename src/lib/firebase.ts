import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAMF3VF0bis3Cw_LI1gQR6Y2ay85F0a9gM",
  authDomain: "horizontodo-50d9f.firebaseapp.com",
  projectId: "horizontodo-50d9f",
  storageBucket: "horizontodo-50d9f.firebasestorage.app",
  messagingSenderId: "221979366375",
  appId: "1:221979366375:web:349abd3c9b03d6356be342"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
