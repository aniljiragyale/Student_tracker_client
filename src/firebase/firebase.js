// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ IMPORT THIS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA2IZn-Y-q5pd0hNFsu4I2YNv7LkS5xVQ",
  authDomain: "student-progress-tracker-7c64d.firebaseapp.com",
  projectId: "student-progress-tracker-7c64d",
  storageBucket: "student-progress-tracker-7c64d.appspot.com", // fixed `.app` typo
  messagingSenderId: "59642185008",
  appId: "1:59642185008:web:98c786a821318d2df4b4f5",
  measurementId: "G-S8K8Z27GXN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize Firestore and export it
export const db = getFirestore(app);
