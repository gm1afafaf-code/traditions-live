import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  CompliancePortal,
  TrackingPortal,
} from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route
          path={ROUTES.COMPLIANCE}
          element={
            <PublicOnlyRoute>
              <Compliance />
            </PublicOnlyRoute>
          }
        />
        <Route
          path={ROUTES.TRACKING}
          element={
            <PublicOnlyRoute>
              <Tracking />
            </PublicOnlyRoute>
          }
        />

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
        <Route
          path={ROUTES.COMPLIANCE_PORTAL}
          element={
            <ProtectedRoute requireApproval>
              <CompliancePortal />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TRACKING_PORTAL}
          element={
            <ProtectedRoute requireApproval>
              <TrackingPortal />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-marble flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // If authenticated and on marketing page, redirect to portal version
  if (isAuthenticated) {
    if (location.pathname === ROUTES.COMPLIANCE) {
      return <Navigate to={ROUTES.COMPLIANCE_PORTAL} replace />;
    }
    if (location.pathname === ROUTES.TRACKING) {
      return <Navigate to={ROUTES.TRACKING_PORTAL} replace />;
    }
  }

  return <>{children}</>;
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
