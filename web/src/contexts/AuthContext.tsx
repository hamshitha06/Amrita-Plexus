'use client';

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<string | null>;
  fetchUser: () => Promise<string | null>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const DEFAULT_DEMO_USER: User = {
  id: 'usr-1',
  name: 'Hamshitha',
  email: 'cb.en.u4xxx@cb.students.amrita.edu',
  roles: ['student'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USER);
  const [accessToken, setAccessToken] = useState<string | null>('demo-access-token');
  const [isLoading, setIsLoading] = useState(false);
  const refreshPromise = useRef<Promise<string | null> | null>(null);

  const refreshTokens = useCallback(async (): Promise<string | null> => {
    if (refreshPromise.current) return refreshPromise.current;

    refreshPromise.current = (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          // Keep demo user if server not active
          return 'demo-access-token';
        }

        const data = await res.json();
        setUser(data.user);
        setAccessToken(data.accessToken);
        return data.accessToken as string;
      } catch {
        return 'demo-access-token';
      } finally {
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (accessToken) return accessToken;
    return refreshTokens();
  }, [accessToken, refreshTokens]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    setUser(data.user);
    setAccessToken(data.accessToken);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshTokens,
        fetchUser: refreshTokens,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
