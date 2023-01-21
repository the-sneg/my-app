import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDd5LnLEnTs_YPmj9kOFO4ExHZYwAK1FCk",
  authDomain: "social-b68c8.firebaseapp.com",
  projectId: "social-b68c8",
  storageBucket: "social-b68c8.appspot.com",
  messagingSenderId: "943917999247",
  appId: "1:943917999247:web:5d7202dfa19d290f18fcfa",
  measurementId: "G-07BH1SBVYK",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
export const test = firebase.initializeApp(firebaseConfig);

export { app, firebase };
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
