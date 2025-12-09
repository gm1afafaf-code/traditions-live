import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    } catch (err) {
      // Error is handled in the auth store
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />

      <div className="relative bg-dark-50 border border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <Leaf className="w-10 h-10 text-emerald-500" />
            <span className="text-3xl font-display tracking-wider text-white">VOUCHED</span>
          </Link>
          <p className="text-gray-400">Sign in to access your account</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 px-6 py-4 rounded-lg font-semibold transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-dark-50 px-4 text-gray-500">or</span>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition">
              Create Account
            </a>
          </p>
          <p className="text-sm text-gray-500">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Forgot Password?
            </a>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-emerald-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
