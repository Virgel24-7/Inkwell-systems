import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNJQ3mVwHd3UQfHpABczul94S7idozL1c",
  authDomain: "inkwell-sys.firebaseapp.com",
  projectId: "inkwell-sys",
  storageBucket: "inkwell-sys.appspot.com",
  messagingSenderId: "160191100269",
  appId: "1:160191100269:web:33a4f759c15457bc451664",
  measurementId: "G-L3HLG1MBMY",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
