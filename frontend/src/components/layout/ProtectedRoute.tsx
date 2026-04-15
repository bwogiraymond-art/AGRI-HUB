import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: Role;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
