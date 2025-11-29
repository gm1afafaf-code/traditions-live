import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useNotification } from '@/hooks';
import { Button, Card, Loading } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

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
      <div className="min-h-screen bg-marble flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marble flex items-center justify-center p-4">
      <Card className="max-w-md w-full" padding="lg">
        <div className="text-center mb-8">
          <h1 className="serif text-4xl font-bold text-charcoal mb-2">
            <span className="text-gold">V</span>OUCHED
          </h1>
          <p className="text-sm text-slate uppercase tracking-widest">New York</p>
          <p className="text-slate mt-4">Sign in to access the platform</p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
          isLoading={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="mt-6 text-center text-sm text-slate">
          <p>NYS OCM License Required</p>
          <p className="mt-2">Don't have access? <a href="#" className="text-gold hover:underline">Request Account</a></p>
        </div>
      </Card>
    </div>
  );
}
