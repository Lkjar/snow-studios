import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// COLE AQUI AS SUAS CREDENCIAIS DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyASBY7rIToHzgk5RwkRH-rX2q7Ycddu5zg",
  authDomain: "snow-studios-34f19.firebaseapp.com",
  projectId: "snow-studios-34f19",
  storageBucket: "snow-studios-34f19.firebasestorage.app",
  messagingSenderId: "996169752852",
  appId: "1:996169752852:web:10d4b275cbc84c1fb2e201"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);