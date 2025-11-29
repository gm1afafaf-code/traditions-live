import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { Button, Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export function PendingApproval() {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useAuth();

  useEffect(() => {
    if (user?.approved) {
      navigate(ROUTES.VAULT);
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    await refreshUser();
  };

  return (
    <div className="min-h-screen bg-marble flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full text-center" padding="lg">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="serif text-3xl font-bold text-charcoal mb-4">Approval Pending</h1>
          <p className="text-slate text-lg mb-2">
            Your account is currently under review by our admin team.
          </p>
          <p className="text-slate/70">
            We'll notify you via email once your account has been approved.
          </p>
        </div>

        {user && (
          <div className="bg-marble-dark rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-charcoal mb-4">Account Details</h3>
            <div className="space-y-2 text-left">
              <InfoRow label="Name" value={`${user.firstName} ${user.lastName}`} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Company" value={user.companyName} />
              <InfoRow label="License" value={user.licenseNumber} />
              <InfoRow label="Type" value={user.businessType} />
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh Status
          </Button>
          <Button variant="ghost" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-black/5 last:border-0">
      <span className="text-slate/70 text-sm">{label}</span>
      <span className="text-charcoal font-medium text-sm">{value}</span>
    </div>
  );
}
