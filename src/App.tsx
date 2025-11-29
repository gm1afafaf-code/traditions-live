import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { ROUTES } from '@/lib/constants';
import { Loading } from '@/components/ui';
import {
  Landing,
  Login,
  ProfileSetup,
  PendingApproval,
  Vault,
  BrokerDashboard,
  AdminDashboard,
  Compliance,
  Tracking,
} from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.COMPLIANCE} element={<Compliance />} />
        <Route path={ROUTES.TRACKING} element={<Tracking />} />

        {/* Protected Routes */}
        <Route
          path={ROUTES.PROFILE_SETUP}
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PENDING_APPROVAL}
          element={
            <ProtectedRoute>
              <PendingApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.VAULT}
          element={
            <ProtectedRoute requireApproval>
              <Vault />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.BROKER_DASHBOARD}
          element={
            <ProtectedRoute requireApproval>
              <BrokerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute requireApproval requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  requireRole?: 'admin' | 'employee' | 'broker';
}

function ProtectedRoute({ children, requireApproval, requireRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-marble flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user) {
    return <Navigate to={ROUTES.PROFILE_SETUP} replace />;
  }

  if (requireApproval && !user.approved) {
    return <Navigate to={ROUTES.PENDING_APPROVAL} replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to={ROUTES.VAULT} replace />;
  }

  return <>{children}</>;
}

export default App;
