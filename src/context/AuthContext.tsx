'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'hms_token';
const USER_KEY = 'hms_user';

function dashboardPathForRole(role: string) {
  if (role === 'ADMIN' || role === 'WARDEN') return '/admin/dashboard';
  return '/student/dashboard';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    const cachedUser = Cookies.get(USER_KEY);

    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        // ignore malformed cache
      }
      authService
        .getMe()
        .then((freshUser) => {
          setUser(freshUser);
          Cookies.set(USER_KEY, JSON.stringify(freshUser), { expires: 7 });
        })
        .catch(() => {
          Cookies.remove(TOKEN_KEY);
          Cookies.remove(USER_KEY);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const persistSession = useCallback((nextUser: User, token: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
    Cookies.set(USER_KEY, JSON.stringify(nextUser), { expires: 7 });
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const { user: loggedInUser, token } = await authService.login(payload);
        persistSession(loggedInUser, token);
        return loggedInUser;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const { user: newUser, token } = await authService.register(payload);
        persistSession(newUser, token);
        return newUser;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
    setUser(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    const freshUser = await authService.getMe();
    setUser(freshUser);
    Cookies.set(USER_KEY, JSON.stringify(freshUser), { expires: 7 });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { dashboardPathForRole };
