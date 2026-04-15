import { createContext, useContext, useState, } from 'react';
import { type ReactNode } from 'react';
import type { AuthState, LoginCredentials, User } from '../types/auth.types';

// ─── Mock user store (replace with real API calls) ────────────────────────
const MOCK_USERS: Record<string, User> = {
  'NKS-F-00142': { id: 'NKS-F-00142',   name: 'Lwanga Cyrus',  role: 'farmer',   district: 'Wakiso' },
  'NKS-F-00089': { id: 'NKS-F-00089',   name: 'Taka Erina',    role: 'farmer',   district: 'Mukono' },
  'KCCA-OFF-019':{ id: 'KCCA-OFF-019',  name: 'Amara Kato',    role: 'official', department: 'KCCA' },
  'KCCA-ADM-003':{ id: 'KCCA-ADM-003',  name: 'Market Admin',  role: 'admin',    department: 'KCCA' },
  'TRD-00055':   { id: 'TRD-00055',     name: 'Okello James',  role: 'trader' },
};

// ─── Context shape ────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login:  (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(s => ({ ...s, isLoading: true }));

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const user = MOCK_USERS[credentials.userId];

    // Validate: user must exist AND role must match
    if (user && user.role === credentials.role) {
      setState({ user, isAuthenticated: true, isLoading: false });
      return true;
    }

    setState(s => ({ ...s, isLoading: false }));
    return false;
  };

  const logout = () => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
