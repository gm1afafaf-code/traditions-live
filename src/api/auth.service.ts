import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types';
import { getUserById } from './user.service';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<{ firebaseUser: FirebaseUser; user: User | null }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Fetch user data from Firestore
    const user = await getUserById(firebaseUser.uid);

    return { firebaseUser, user };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error('Failed to sign in with Google');
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user ID token
 */
export async function getUserToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
}

/**
 * Refresh user token
 */
export async function refreshUserToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Error refreshing user token:', error);
    return null;
  }
}
