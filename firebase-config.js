// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_SK7KsPGF4-V5xIsefe0bsQTUex_5dhI",
  authDomain: "crud-systems.firebaseapp.com",
  projectId: "crud-systems",
  storageBucket: "crud-systems.appspot.com",
  messagingSenderId: "476600295670",
  appId: "1:476600295670:web:3f9cf5cf925201e7c30cd7",
  measurementId: "G-JHPYWMFXSY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };