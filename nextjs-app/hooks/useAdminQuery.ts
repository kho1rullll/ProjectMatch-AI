// hooks/useAdminQuery.ts — TanStack Query v5 Hooks untuk Entitas Kedua (Mahasiswa & Admin) (Modul 7)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminData,
  verifyStudentStatus,
  updateKioskStatusApi,
  AdminDataResponse,
} from '@/services/adminApi';

const ADMIN_CACHE_CONFIG = {
  staleTime: 3 * 60 * 1000, // 3 menit
  gcTime: 10 * 60 * 1000,   // 10 menit
};

export function useAdminQuery() {
  return useQuery<AdminDataResponse, Error>({
    queryKey: ['admin-data'],
    queryFn: fetchAdminData,
    ...ADMIN_CACHE_CONFIG,
  });
}

export function useVerifyStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyStudentStatus,
    onSuccess: () => {
      // Invalidation queryKey 'admin-data' to update students list & verified count
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
    },
  });
}

export function useUpdateKioskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateKioskStatusApi,
    onSuccess: () => {
      // Invalidation queryKey 'admin-data' to update kiosk statuses
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
    },
  });
}
