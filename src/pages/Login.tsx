import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useNotification } from '@/hooks';
import { Loading } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { Leaf } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login, user, isAuthenticated, isLoading, error } = useAuth();
  const { showError } = useNotification();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.approved) {
        navigate(ROUTES.PENDING_APPROVAL);
      } else {
        navigate(ROUTES.VAULT);
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleGoogleSignIn = async () => {
    try {
      await login();
    } catch {
      // Error is handled in the auth store
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-4">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen luxury-bg gold-veins flex items-center justify-center px-4 py-8">
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="bg-obsidian/80 backdrop-blur-xl border border-gold/20 rounded-xl p-6 sm:p-8 shadow-luxury">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-void" />
            </div>
            <h1 className="serif text-3xl sm:text-4xl font-bold text-white mb-2">
              <span className="text-gold">V</span>OUCHED
            </h1>
            <p className="text-xs sm:text-sm text-gold/60 uppercase tracking-widest">New York</p>
            <p className="text-white/60 mt-3 sm:mt-4 text-sm sm:text-base">Sign in to access the platform</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-void font-semibold rounded-lg hover:shadow-gold-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Footer */}
          <div className="mt-6 text-center text-xs sm:text-sm text-white/50">
            <p>NYS OCM License Required</p>
            <p className="mt-2">Don't have access? <a href="#" className="text-gold hover:text-gold-light transition">Request Account</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
