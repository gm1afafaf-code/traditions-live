import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
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
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ firebaseUser: FirebaseUser; user: User | null }> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    // Fetch user data from Firestore
    const user = await getUserById(firebaseUser.uid);

    return { firebaseUser, user };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Email sign-in error:', authError);
    
    // Provide user-friendly error messages
    switch (authError.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        throw new Error('Invalid email or password');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password sign-in is not enabled. Please contact support.');
      default:
        throw new Error('Failed to sign in. Please try again.');
    }
  }
}

/**
 * Create account with email and password
 */
export async function createAccountWithEmail(email: string, password: string): Promise<{ firebaseUser: FirebaseUser; user: User | null }> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    // New user won't have a Firestore profile yet
    return { firebaseUser, user: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Email sign-up error:', authError);
    
    // Provide user-friendly error messages
    switch (authError.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/weak-password':
        throw new Error('Password is too weak. Use at least 6 characters');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password sign-up is not enabled. Please contact support.');
      default:
        throw new Error('Failed to create account. Please try again.');
    }
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
