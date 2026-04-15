export type Role = 'farmer' | 'trader' | 'official' | 'admin';

export interface User {
  id: string;          // e.g. NKS-F-00142 / KCCA-OFF-019 / KCCA-ADM-003
  name: string;
  role: Role;
  district?: string;   // home district (farmers)
  department?: string; // KCCA / MAAIF (officials + admins)
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  userId: string;
  password: string;
  role: Role;
}
