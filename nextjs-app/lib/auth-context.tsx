'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'MAHASISWA' | 'MITRA' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badge?: string;
  organization?: string;
  nim?: string;
  gpa?: string;
  rfidUid?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: UserRole, email?: string) => void;
  switchAccount: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const PRESET_ACCOUNTS: Record<UserRole, AuthUser> = {
  MAHASISWA: {
    id: 'usr-student-001',
    name: 'Raden Satria',
    email: 'satria@student.itb.ac.id',
    role: 'MAHASISWA',
    badge: 'Hero Tier S (Lv. 4)',
    organization: 'D3 Teknik Informatika PSDKU Madiun, UNS',
    nim: 'V3925028',
    gpa: '3.88',
    rfidUid: '0x8F3A29B1',
  },
  MITRA: {
    id: 'usr-partner-001',
    name: 'Dr. Hendra Gunawan',
    email: 'hr@bioinformatika.co.id',
    role: 'MITRA',
    badge: 'Mitra Industri Terverifikasi',
    organization: 'BioInformatika Nusantara & RS Cipto',
  },
  ADMIN: {
    id: 'usr-admin-001',
    name: 'Biro Kerjasama & Kemahasiswaan',
    email: 'admin@projectmatch.ac.id',
    role: 'ADMIN',
    badge: 'Administrator Kampus & IoT Manager',
    organization: 'Universitas Sebelas Maret (UNS)',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  switchAccount: () => {},
  logout: () => {},
  isAuthenticated: false,
});

function setSessionCookie(role: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `projectmatch_session=${role}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `projectmatch_role=${role}; path=/; max-age=86400; SameSite=Lax`;
  }
}

function clearSessionCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'projectmatch_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'projectmatch_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Sesi awal fresh: hanya login jika pengguna memang sengaja login (ada flag projectmatch_authenticated)
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('projectmatch_authenticated') === 'true';
      const savedRole = localStorage.getItem('projectmatch_role') as UserRole;

      if (isAuthenticated && savedRole && PRESET_ACCOUNTS[savedRole]) {
        const account = PRESET_ACCOUNTS[savedRole];
        setSessionCookie(savedRole);
        queueMicrotask(() => {
          setUser(account);
        });
      } else {
        // FRESH VISITOR: Default tidak terlogin sama sekali
        localStorage.removeItem('projectmatch_authenticated');
        localStorage.removeItem('projectmatch_role');
        localStorage.removeItem('projectmatch_user');
        clearSessionCookie();
        queueMicrotask(() => {
          setUser(null);
        });
      }
    }
  }, []);

  const login = (role: UserRole, email?: string) => {
    const template = PRESET_ACCOUNTS[role] || PRESET_ACCOUNTS.MAHASISWA;
    const authData = { ...template, email: email || template.email };
    setUser(authData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectmatch_authenticated', 'true');
      localStorage.setItem('projectmatch_role', role);
      localStorage.setItem('projectmatch_user', JSON.stringify(authData));
    }
    setSessionCookie(role);
  };

  const switchAccount = (role: UserRole) => {
    login(role);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('projectmatch_authenticated');
      localStorage.removeItem('projectmatch_role');
      localStorage.removeItem('projectmatch_user');
    }
    clearSessionCookie();
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
