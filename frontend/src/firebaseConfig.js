import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTXUe9Z9RdnWSUZj1uuFyJj06SjJkCp_k",
  authDomain: "e-marketplace-41f34.firebaseapp.com",
  projectId: "e-marketplace-41f34",
  storageBucket: "e-marketplace-41f34.appspot.com",
  messagingSenderId: "259500868560",
  appId: "1:259500868560:web:f5579d53752906dc376fd5",
  measurementId: "G-SZH0S7FXBX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);