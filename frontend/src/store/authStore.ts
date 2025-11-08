import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminProfile, AuthResponse } from '../types/auth';

interface AuthState {
  admin?: AdminProfile;
  token?: string;
  isAuthenticated: boolean;
  login: (payload: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: undefined,
      token: undefined,
      isAuthenticated: false,
      login: ({ admin, token }) =>
        set({
          admin,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          admin: undefined,
          token: undefined,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'tolu-john-auth',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;

