import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user.types';
import { APP_CONFIG } from '@/constants/config';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(APP_CONFIG.AUTH_TOKEN_KEY, token);
        }
        set({ user, token, isAuthenticated: true, _hasHydrated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(APP_CONFIG.AUTH_TOKEN_KEY);
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set((state) => ({
          user,
          isAuthenticated: !!user && !!state.token,
        }));
      },
    }),
    {
      name: 'rentnest_auth_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (_state, _error) => {
          useAuthStore.setState({ _hasHydrated: true });
        };
      },
    }
  )
);
