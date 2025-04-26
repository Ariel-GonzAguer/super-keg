import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "super-keg.firebaseapp.com",
  projectId: "super-keg",
  storageBucket: "super-keg.firebasestorage.app",
  messagingSenderId: "246634147067",
  appId: "1:246634147067:web:b92015b8610455b608945e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
