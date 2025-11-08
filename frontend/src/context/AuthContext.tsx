import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AdminProfile, AuthResponse } from '../types/auth';

interface AuthContextValue {
  admin?: AdminProfile;
  token?: string;
  isAuthenticated: boolean;
  login: (payload: AuthResponse) => void;
  logout: () => void;
  updateAdmin: (profile: AdminProfile) => void;
}

let tokenRef: string | undefined;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminProfile | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const login = useCallback(({ admin: adminData, token: authToken }: AuthResponse) => {
    setAdmin(adminData);
    setToken(authToken);
    tokenRef = authToken;
  }, []);

  const logout = useCallback(() => {
    setAdmin(undefined);
    setToken(undefined);
    tokenRef = undefined;
  }, []);

  const updateAdmin = useCallback((profile: AdminProfile) => {
    setAdmin(profile);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateAdmin,
    }),
    [admin, token, login, logout, updateAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export const getAuthToken = () => tokenRef;


