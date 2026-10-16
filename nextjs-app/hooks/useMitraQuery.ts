import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMitraData,
  updateApplicantStatusApi,
  deleteProjectApi,
  type MitraDataResponse,
} from '@/services/mitraApi';

const MITRA_CACHE_CONFIG = {
  staleTime: 2 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
};

export function useMitraQuery() {
  return useQuery<MitraDataResponse, Error>({
    queryKey: ['mitra-data'],
    queryFn: fetchMitraData,
    ...MITRA_CACHE_CONFIG,
  });
}

export function useUpdateApplicantStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicantStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitra-data'] });
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitra-data'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-data'] });
    },
  });
}
