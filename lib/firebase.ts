/**
 * AURENIS - Configuración e Inicialización de Firebase SDK para Web
 * 
 * Responsables:
 * - 👑 Maicol R.: Arquitectura backend, inicialización segura y consistencia de credenciales.
 * - 💻 Malcom Marcelo: Consumo del SDK en cliente React y gestión de sesión federada.
 * - 🛡️ Frank M.: Validación de orígenes, mitigación de robo de tokens y auditoría de autenticación.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import firebaseConfigJson from "@/firebase-applet-config.json";

// Configuración con fallback a variables de entorno para entornos CI/CD y despliegue
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: firebaseConfigJson.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: firebaseConfigJson.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: firebaseConfigJson.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: firebaseConfigJson.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: firebaseConfigJson.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Inicialización idempotente
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Proveedor de Google Workspace for Education
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("openid");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { signInWithPopup, firebaseSignOut };
export type { FirebaseUser };

export { signInWithGooglePopup, signOutGoogle } from "./auth/google-auth";
