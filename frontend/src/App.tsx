import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import type { Role } from './types/auth.types';

// Pages (to be created in next steps)
import LoginPage          from './pages/LoginPage';
import FarmerDashboard    from './pages/farmer/FarmerDashboard';
import OfficialDashboard  from './pages/official/OfficialDashboard';
import AdminDashboard     from './pages/admin/AdminDashboard';

// ─── Route guard: redirects if not authenticated or wrong role ────────────
function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: Role;
}) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole)  return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ─── Smart redirect after login ───────────────────────────────────────────
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  const routes: Record<Role, string> = {
    farmer:   '/farmer',
    trader:   '/trader',
    official: '/official',
    admin:    '/admin',
  };
  return <Navigate to={routes[user.role]} replace />;
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"       element={<RootRedirect />} />
            <Route path="/login"  element={<LoginPage />} />

            <Route path="/farmer/*" element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/official/*" element={
              <ProtectedRoute allowedRole="official">
                <OfficialDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/*" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </MarketProvider>
    </AuthProvider>
  );
}
