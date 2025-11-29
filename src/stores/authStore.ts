import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types';
import { signInWithGoogle, signInWithEmail, createAccountWithEmail, signOut, onAuthChange } from '@/api/auth.service';
import { getUserById, updateLastSignIn } from '@/api/user.service';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => void;
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  initialize: () => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await getUserById(firebaseUser.uid);

          if (user) {
            // Update last sign-in time
            await updateLastSignIn(firebaseUser.uid);
          }

          set({
            firebaseUser,
            user,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          console.error('Error loading user:', error);
          set({
            firebaseUser,
            user: null,
            isLoading: false,
            isInitialized: true,
            error: 'Failed to load user data',
          });
        }
      } else {
        set({
          firebaseUser: null,
          user: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      }
    });

    // Return unsubscribe function (though we don't typically unsubscribe in this case)
    return unsubscribe;
  },

  login: async () => {
    set({ isLoading: true, error: null });

    try {
      const { firebaseUser, user } = await signInWithGoogle();

      set({
        firebaseUser,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Login error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      });
      throw error;
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { firebaseUser, user } = await signInWithEmail(email, password);

      set({
        firebaseUser,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Email login error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      });
      throw error;
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { firebaseUser, user } = await createAccountWithEmail(email, password);

      set({
        firebaseUser,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Email sign-up error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create account',
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await signOut();
      set({
        firebaseUser: null,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      });
    }
  },

  refreshUser: async () => {
    const { firebaseUser } = get();
    if (!firebaseUser) return;

    try {
      const user = await getUserById(firebaseUser.uid);
      set({ user });
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
