import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { User } from './authTypes';

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  refreshAccess: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Static hosting cannot verify staff identity or authorise data entry.
// Privileged controls stay unavailable until server-backed authentication exists.
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => { localStorage.removeItem('dnr_user'); }, []);
  return <AuthContext.Provider value={{
    user: null,
    login: async () => false,
    logout: () => { localStorage.removeItem('dnr_user'); },
    isAuthenticated: false,
    refreshAccess: async () => {},
  }}>{children}</AuthContext.Provider>;
}
