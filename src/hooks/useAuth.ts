import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants';
import type { UserRole } from '@/types';

/**
 * Hook for authentication state and actions
 */
export function useAuth() {
  const {
    firebaseUser,
    user,
    isLoading,
    isInitialized,
    error,
    initialize,
    login,
    logout,
    refreshUser,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  return {
    firebaseUser,
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!firebaseUser,
    isApproved: user?.approved || false,
    role: user?.role || null,
    error,
    login,
    logout,
    refreshUser,
    clearError,
  };
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo: string = ROUTES.LOGIN) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, isInitialized, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to require specific role
 * Redirects if user doesn't have required role
 */
export function useRequireRole(
  allowedRoles: UserRole[],
  redirectTo: string = ROUTES.HOME
) {
  const navigate = useNavigate();
  const { user, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading && user) {
      if (!allowedRoles.includes(user.role)) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, isLoading, isInitialized, allowedRoles, navigate, redirectTo]);

  return { user, isLoading };
}

/**
 * Hook to require approval
 * Redirects to pending page if not approved
 */
export function useRequireApproval() {
  const navigate = useNavigate();
  const { user, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading && user && !user.approved) {
      navigate(ROUTES.PENDING_APPROVAL, { replace: true });
    }
  }, [user, isLoading, isInitialized, navigate]);

  return { user, isLoading, isApproved: user?.approved || false };
}
