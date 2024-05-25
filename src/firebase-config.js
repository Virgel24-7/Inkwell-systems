// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq_RFoW7fxmfmp9pR9RhSgQW4RiBBLquo",
  authDomain: "inkwell-systems.firebaseapp.com",
  projectId: "inkwell-systems",
  storageBucket: "inkwell-systems.appspot.com",
  messagingSenderId: "40393222334",
  appId: "1:40393222334:web:a459faed6cdf88275616ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
