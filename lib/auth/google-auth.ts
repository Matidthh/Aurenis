/**
 * AURENIS - Integración Cliente de Google Workspace OAuth2 / Firebase Auth
 * 
 * Responsables:
 * - 💻 Malcom Marcelo: Lógica de cliente React, interacción con SDK y manejo de estado.
 * - 👑 Maicol R.: Arquitectura de autenticación, propagación de tokens y congruencia de sesión.
 * - 🛡️ Frank M.: Validación de seguridad del cliente, mitigación de CSRF/XSS y manejo seguro de tokens.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import firebaseConfig from "@/firebase-applet-config.json";

// Inicialización idempotente del cliente Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Proveedor de Google con los scopes autorizados para Aurenis
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("openid");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export interface GoogleAuthResult {
  ok: boolean;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  idToken?: string;
  accessToken?: string;
  error?: string;
  code?: string;
}

/**
 * Abre el popup de inicio de sesión con Google Workspace
 * y recupera el usuario federado con su respectivo ID Token criptográfico.
 */
export async function signInWithGooglePopup(): Promise<GoogleAuthResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const idToken = await result.user.getIdToken();

    return {
      ok: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      idToken,
      accessToken: credential?.accessToken,
    };
  } catch (error: any) {
    const code = error?.code || "auth/unknown";
    let message = "No fue posible completar la autenticación con Google.";

    if (code === "auth/popup-blocked") {
      message = "La ventana emergente de Google fue bloqueada por tu navegador. Por favor permite ventanas emergentes para este sitio.";
    } else if (code === "auth/popup-closed-by-user") {
      message = "Se cerró la ventana de autenticación de Google antes de completar el acceso.";
    } else if (code === "auth/cancelled-popup-request") {
      message = "Operación de acceso cancelada por una nueva solicitud.";
    } else if (code === "auth/unauthorized-domain") {
      message = "El dominio actual no está habilitado en la consola de Google/Firebase para este proyecto.";
    } else if (error?.message) {
      message = error.message;
    }

    return {
      ok: false,
      error: message,
      code,
    };
  }
}

/**
 * Cierre de sesión de Google a nivel de cliente
 */
export async function signOutGoogle(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn("[Google Auth] Error al cerrar sesión en Firebase:", err);
  }
}
