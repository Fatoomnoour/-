import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUserProfile } from "./firestoreService";

export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  if (!auth) throw new Error("Firebase auth not initialized");
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfile(result.user.uid, {
    displayName: result.user.displayName,
    email: result.user.email,
    photoURL: result.user.photoURL,
  });
  return result.user;
}

export async function registerWithEmail(email: string, password: string, name: string) {
  if (!auth) throw new Error("Firebase auth not initialized");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await createUserProfile(result.user.uid, {
    displayName: name,
    email: email,
  });
  return result.user;
}

export async function loginWithEmail(email: string, password: string) {
  if (!auth) throw new Error("Firebase auth not initialized");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logout() {
  if (!auth) throw new Error("Firebase auth not initialized");
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
