// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMaokR9eCXwX61uOwV5hQmLRiyXD_lnFY",
  authDomain: "mindpilot-8af5b.firebaseapp.com",
  projectId: "mindpilot-8af5b",
  storageBucket: "mindpilot-8af5b.firebasestorage.app",
  messagingSenderId: "108457538667",
  appId: "1:108457538667:web:744e4fa293491e83c22d2e",
  measurementId: "G-ZBN3M202H5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth= getAuth(app);
export{ app, auth };

