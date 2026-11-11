'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, removeStoredToken } from './api-client';
import { AuthUser } from '@/types/auth';

export type UserRole = 'mahasiswa' | 'admin' | 'MAHASISWA' | 'ADMIN';
export type { AuthUser };

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {
    throw new Error('AuthProvider belum siap.');
  },
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Bersihkan sisa persistensi lama di localStorage dari sesi pengujian terdahulu
      localStorage.removeItem('projectmatch_role');
      localStorage.removeItem('projectmatch_user');
      localStorage.removeItem('projectmatch_token');

      // Ambil sesi login yang valid dari sessionStorage
      const stored = api.auth.getCurrentUser();
      if (stored) {
        setUser(stored);
      } else {
        // Pengunjung awal: Belum terlogin ke akun manapun (Guest / Unauthenticated)
        setUser(null);
        removeStoredToken();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    if (!email.includes('@') || !password) {
      throw new Error('Email dan kata sandi wajib diisi.');
    }

    const resp = await api.auth.login(email.trim().toLowerCase(), password);
    const authData: AuthUser = {
      ...resp.user,
      name: resp.user.name || resp.user.full_name || resp.user.email?.split('@')[0] || 'Pengguna',
      full_name: resp.user.full_name || resp.user.name || 'Pengguna',
      role: (resp.user.role.toLowerCase() as 'mahasiswa' | 'admin'),
      nim: resp.user.nim,
      github_username: resp.user.github_username,
    };
    setUser(authData);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('projectmatch_role', authData.role);
      sessionStorage.setItem('projectmatch_user', JSON.stringify(authData));
    }
    return authData;
  };

  const logout = () => {
    setUser(null);
    api.auth.logout();
    removeStoredToken();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('projectmatch_role');
      sessionStorage.removeItem('projectmatch_user');
      sessionStorage.removeItem('projectmatch_token');
      localStorage.removeItem('projectmatch_role');
      localStorage.removeItem('projectmatch_user');
      localStorage.removeItem('projectmatch_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
