import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

interface AgeVerificationProps {
  children: React.ReactNode;
}

export function AgeVerification({ children }: AgeVerificationProps) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('vouched-age-verified');
    if (isVerified === 'true') {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, []);

  const handleVerify = (isOver21: boolean) => {
    if (isOver21) {
      localStorage.setItem('vouched-age-verified', 'true');
      setVerified(true);
    } else {
      setDenied(true);
    }
  };

  if (verified === null) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse">
          <Leaf className="w-12 h-12 text-emerald-500" />
        </div>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Leaf className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-display tracking-wide text-white mb-4">
            ACCESS DENIED
          </h1>
          <p className="text-gray-400 mb-8">
            Sorry, you must be 21 years or older to access this website.
          </p>
          <a
            href="https://www.google.com"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Leave Site
          </a>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative bg-dark-50 border border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Leaf className="w-10 h-10 text-emerald-500" />
            <span className="text-3xl font-display tracking-wider text-white">VOUCHED</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display tracking-wide text-white mb-4">
            AGE VERIFICATION
          </h1>
          <p className="text-gray-400 mb-8">
            You must be 21 years or older to enter this website. Please verify your age.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => handleVerify(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-lg font-semibold text-lg transition"
            >
              Yes, I'm 21 or older
            </button>
            <button
              onClick={() => handleVerify(false)}
              className="w-full bg-dark border border-white/10 hover:border-white/30 text-gray-300 py-4 rounded-lg font-semibold text-lg transition"
            >
              No, I'm under 21
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            By entering this site, you agree to our{' '}
            <a href="/terms" className="text-emerald-400 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-emerald-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
