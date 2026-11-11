// lib/api-client.ts — Klien HTTP Terpusat untuk Komunikasi ke Backend ProjectMatch AI (/api/v1)
import { AuthUser } from '@/types/auth';
import { JobVacancy } from '@/types/job';
import { RecommendationItem, MatchDetail } from '@/types/matching';
import { AdminUserItem, AdminStatistics } from '@/types/admin';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('projectmatch_token');
}

export function setStoredToken(token: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('projectmatch_token', token);
    // Gunakan session cookie (tanpa max-age panjang) agar sesi otomatis berakhir saat peramban ditutup
    document.cookie = `projectmatch_session=${token}; path=/; SameSite=Lax`;
  }
}

export function removeStoredToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('projectmatch_token');
    sessionStorage.removeItem('projectmatch_user');
    sessionStorage.removeItem('projectmatch_role');
    localStorage.removeItem('projectmatch_token');
    localStorage.removeItem('projectmatch_user');
    localStorage.removeItem('projectmatch_role');
    document.cookie = 'projectmatch_session=; path=/; max-age=0; SameSite=Lax';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Coba panggil FastAPI Backend dulu
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1${endpoint}`, {
      ...options,
      headers,
    });

    if (res.ok) {
      return (await res.json()) as T;
    }

    const errData = await res.json().catch(() => ({ detail: 'Terjadi kesalahan sistem.' }));
    const httpError = new Error(errData.detail || errData.message || `HTTP ${res.status}`) as Error & {
      isHttpError?: boolean;
      status?: number;
    };
    httpError.isHttpError = true;
    httpError.status = res.status;
    throw httpError;
  } catch (backendError: any) {
    // Jika backend sudah merespons HTTP error (mis. 401/403/409), lempar langsung tanpa fallback
    if (backendError?.isHttpError) {
      throw backendError;
    }
    // Jika backend FastAPI tidak aktif / unreachable, fallback ke Next.js internal API route
    try {
      const internalRes = await fetch(`/api/v1${endpoint}`, {
        ...options,
        headers,
      });
      if (internalRes.ok) {
        return (await internalRes.json()) as T;
      }
    } catch {
      // Abaikan internal error dan lempar error utama
    }
    // Perjelas pesan error jika koneksi ke backend gagal
    if (backendError?.message === 'Failed to fetch' || backendError?.name === 'TypeError') {
      throw new Error('Gagal terhubung ke server backend FastAPI (Port 8000). Pastikan backend aktif.');
    }
    throw backendError;
  }
}

export const api = {
  // 1. Auth (FR-01)
  auth: {
    async login(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
      const data = await request<{ access_token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const normalizedUser: AuthUser = {
        ...data.user,
        name: data.user.name || data.user.full_name || data.user.email?.split('@')[0] || 'Pengguna',
        role: (data.user.role?.toLowerCase() as 'mahasiswa' | 'admin') || 'mahasiswa',
      };
      setStoredToken(data.access_token);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('projectmatch_user', JSON.stringify(normalizedUser));
        sessionStorage.setItem('projectmatch_role', normalizedUser.role);
        localStorage.removeItem('projectmatch_token');
        localStorage.removeItem('projectmatch_user');
        localStorage.removeItem('projectmatch_role');
      }
      return { ...data, user: normalizedUser };
    },

    async register(payload: {
      email: string;
      password: string;
      full_name: string;
      nim: string;
      github_username: string;
      program_studi?: string;
      angkatan?: number;
    }): Promise<{ access_token: string; user: AuthUser }> {
      const data = await request<{ access_token: string; user: AuthUser }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const normalizedUser: AuthUser = {
        ...data.user,
        name: data.user.name || data.user.full_name || data.user.email?.split('@')[0] || 'Pengguna',
        role: (data.user.role?.toLowerCase() as 'mahasiswa' | 'admin') || 'mahasiswa',
      };
      setStoredToken(data.access_token);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('projectmatch_user', JSON.stringify(normalizedUser));
        sessionStorage.setItem('projectmatch_role', normalizedUser.role);
        localStorage.removeItem('projectmatch_token');
        localStorage.removeItem('projectmatch_user');
        localStorage.removeItem('projectmatch_role');
      }
      return { ...data, user: normalizedUser };
    },

    logout() {
      removeStoredToken();
    },

    getCurrentUser(): AuthUser | null {
      if (typeof window === 'undefined') return null;
      const uStr = sessionStorage.getItem('projectmatch_user');
      if (!uStr) return null;
      try {
        const parsed = JSON.parse(uStr);
        return {
          ...parsed,
          name: parsed.name || parsed.full_name || parsed.email?.split('@')[0] || 'Pengguna',
        };
      } catch {
        return null;
      }
    },
  },

  // 2. Profile (FR-02, FR-03)
  profile: {
    async getMyProfile(): Promise<any> {
      return request('/profiles/me');
    },

    async updateMyProfile(payload: {
      full_name?: string;
      program_studi?: string;
      angkatan?: number;
      github_username?: string;
    }): Promise<any> {
      return request('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async syncGitHub(github_username?: string): Promise<{ status: string; message: string; processing_status: string }> {
      return request('/profiles/github/sync', {
        method: 'POST',
        body: JSON.stringify({ github_username }),
      });
    },
  },

  // 3. Jobs & Bookmarks (FR-04, FR-08, FR-10)
  jobs: {
    async getJobs(params?: { platform?: string; job_type?: string }): Promise<JobVacancy[]> {
      const query = new URLSearchParams();
      if (params?.platform && params.platform !== 'semua') query.append('platform', params.platform);
      if (params?.job_type && params.job_type !== 'semua') query.append('job_type', params.job_type);
      const qStr = query.toString() ? `?${query.toString()}` : '';
      return request(`/jobs${qStr}`);
    },

    async getJobDetail(jobId: string): Promise<JobVacancy> {
      return request(`/jobs/${jobId}`);
    },

    async syncJobs(): Promise<{ status: string; message: string }> {
      return request('/jobs/sync', {
        method: 'POST',
      });
    },

    async refreshLiveJobs(): Promise<{ status: string; message: string }> {
      return request('/jobs/refresh-live', {
        method: 'POST',
      });
    },

    async bookmarkJob(jobId: string): Promise<{ id: string; message: string }> {
      return request(`/jobs/${jobId}/bookmark`, {
        method: 'POST',
      });
    },

    async removeBookmark(jobId: string): Promise<{ status: string; message: string }> {
      return request(`/jobs/${jobId}/bookmark`, {
        method: 'DELETE',
      });
    },

    async getMyBookmarks(): Promise<JobVacancy[]> {
      return request('/bookmarks/me');
    },
  },

  // 4. Matching & Recommendations (FR-06, FR-07)
  matching: {
    async getMyRecommendations(): Promise<RecommendationItem[]> {
      return request('/recommendations/me');
    },

    async getMatchDetail(jobId: string): Promise<MatchDetail> {
      return request(`/matches/${jobId}/me`);
    },
  },

  // 5. Notifications (FR-09)
  notifications: {
    async getNotifications(): Promise<any[]> {
      return request('/notifications');
    },

    async markAsRead(notifId: string): Promise<any> {
      return request(`/notifications/${notifId}/read`, {
        method: 'PATCH',
      });
    },
  },

  // 6. Admin (FR-11, FR-12)
  admin: {
    async getUsers(): Promise<AdminUserItem[]> {
      return request('/admin/users');
    },

    async updateUser(payload: { user_id: string; is_active?: boolean; role?: string }): Promise<AdminUserItem> {
      return request('/admin/users', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },

    async resetUserPassword(userId: string, newPassword: string): Promise<AdminUserItem> {
      return request(`/admin/users/${userId}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ new_password: newPassword }),
      });
    },

    async deleteUser(userId: string): Promise<{ status: string; user_id: string; email: string }> {
      return request(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
    },

    async getStatistics(): Promise<AdminStatistics> {
      return request('/admin/statistics');
    },
  },
};
