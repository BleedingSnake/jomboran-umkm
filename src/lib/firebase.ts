// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSC_lJ7fw0TUzPjlWNnKUDaBmGyv7yKVI",
  authDomain: "jomboran-fin.firebaseapp.com",
  projectId: "jomboran-fin",
  storageBucket: "jomboran-fin.firebasestorage.app",
  messagingSenderId: "595681174212",
  appId: "1:595681174212:web:c405e946c1b68a605a9f91",
  measurementId: "G-K0QMKGCGDH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);