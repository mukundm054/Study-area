// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV5I9hHdJNkWMfXDqjf-90EiEAlCLmlPM",
  authDomain: "studyarea-14866.firebaseapp.com",
  projectId: "studyarea-14866",
  storageBucket: "studyarea-14866.firebasestorage.app",
  messagingSenderId: "316885433964",
  appId: "1:316885433964:web:47d5fb73f75de815b3a249"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}