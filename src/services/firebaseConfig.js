import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC5tMzDZCZaCCwoPZ-K25Efu6FmRSVH8ng",
  authDomain: "bookiquee.firebaseapp.com",
  projectId: "bookiquee",
  storageBucket: "bookiquee.firebasestorage.app",
  messagingSenderId: "1088412281946",
  appId: "1:1088412281946:web:e5b59ca854ec92f9347c63",
  measurementId: "G-JLRYHZ22YG"
};

// Initialize Firebase (this will be called in App.jsx)
export const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
};
