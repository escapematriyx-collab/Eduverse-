import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxOz-7xZuT_2E1eWyKBlzcDAjEkc_tRgU",
  authDomain: "eduverse2-827fb.firebaseapp.com",
  projectId: "eduverse2-827fb",
  storageBucket: "eduverse2-827fb.firebasestorage.app",
  messagingSenderId: "119222279358",
  appId: "1:119222279358:web:79c9ba0b881d44699cd2ef",
  measurementId: "G-2RFDL16LMY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);