'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setStoredToken, removeStoredToken } from './api-client';
import { AuthUser } from '@/types/auth';

export type UserRole = 'mahasiswa' | 'admin' | 'MAHASISWA' | 'ADMIN';
export type { AuthUser };

interface AuthContextType {
  user: AuthUser | null;
  login: (roleOrEmail: string, passwordOrEmail?: string) => Promise<void>;
  switchAccount: (role: 'mahasiswa' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const PRESET_ACCOUNTS: Record<'mahasiswa' | 'admin', AuthUser> = {
  mahasiswa: {
    id: 'usr-student-001',
    name: 'Raden Satria',
    full_name: 'Raden Satria',
    email: 'satria@student.itb.ac.id',
    role: 'mahasiswa',
    organization: 'D3 Teknik Informatika PSDKU Madiun, UNS',
    nim: 'V3925028',
    github_username: 'kho1rullll',
  },
  admin: {
    id: 'usr-admin-001',
    name: 'Administrator Kampus',
    full_name: 'Biro Kemahasiswaan & Kerjasama UNS',
    email: 'admin@projectmatch.ac.id',
    role: 'admin',
    organization: 'Universitas Sebelas Maret (UNS)',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  switchAccount: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = api.auth.getCurrentUser();
      if (stored) {
        setUser(stored);
      } else {
        const savedRole = localStorage.getItem('projectmatch_role') as 'mahasiswa' | 'admin';
        if (savedRole && PRESET_ACCOUNTS[savedRole]) {
          setUser(PRESET_ACCOUNTS[savedRole]);
        }
      }
    }
  }, []);

  const login = async (roleOrEmail: string, passwordOrEmail?: string) => {
    // Jika login menggunakan email & password
    if (roleOrEmail.includes('@')) {
      try {
        const resp = await api.auth.login(roleOrEmail, passwordOrEmail || 'password123');
        const authData: AuthUser = {
          ...resp.user,
          name: resp.user.name || resp.user.full_name || 'Pengguna',
          role: (resp.user.role.toLowerCase() as 'mahasiswa' | 'admin'),
        };
        setUser(authData);
        localStorage.setItem('projectmatch_role', authData.role);
        return;
      } catch (e) {
        // Fallback jika FastAPI offline, gunakan preset matching
        const normalizedEmail = roleOrEmail.toLowerCase();
        if (normalizedEmail.includes('admin')) {
          const acc = PRESET_ACCOUNTS.admin;
          setUser(acc);
          setStoredToken('mock-admin-token');
          localStorage.setItem('projectmatch_role', 'admin');
          localStorage.setItem('projectmatch_user', JSON.stringify(acc));
          return;
        } else {
          const acc = PRESET_ACCOUNTS.mahasiswa;
          setUser(acc);
          setStoredToken('mock-mahasiswa-token');
          localStorage.setItem('projectmatch_role', 'mahasiswa');
          localStorage.setItem('projectmatch_user', JSON.stringify(acc));
          return;
        }
      }
    }

    // Login via tombol cepat / switch role
    const targetRole = roleOrEmail.toLowerCase() === 'admin' ? 'admin' : 'mahasiswa';
    const acc = PRESET_ACCOUNTS[targetRole];
    setUser(acc);
    setStoredToken(`mock-${targetRole}-token`);
    localStorage.setItem('projectmatch_role', targetRole);
    localStorage.setItem('projectmatch_user', JSON.stringify(acc));
  };

  const switchAccount = (role: 'mahasiswa' | 'admin') => {
    const acc = PRESET_ACCOUNTS[role];
    setUser(acc);
    setStoredToken(`mock-${role}-token`);
    localStorage.setItem('projectmatch_role', role);
    localStorage.setItem('projectmatch_user', JSON.stringify(acc));
  };

  const logout = () => {
    setUser(null);
    api.auth.logout();
    removeStoredToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('projectmatch_role');
      localStorage.removeItem('projectmatch_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, switchAccount, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
