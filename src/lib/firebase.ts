import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLTVV76h6GTMKScpBH11K-yuN9ULxKYCU",
  authDomain: "youthevent-a8175.firebaseapp.com",
  projectId: "youthevent-a8175",
  storageBucket: "youthevent-a8175.firebasestorage.app",
  messagingSenderId: "558292616233",
  appId: "1:558292616233:web:e8f477d24427f7ced44838",
  measurementId: "G-WX13EFR5ZS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
