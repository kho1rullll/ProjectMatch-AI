// hooks/useProjects.ts — TanStack Query v5 Hooks untuk Server State (Modul 7)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, fetchProjectById, createProject } from '@/services/projectApi';
import { CreateProjectInput, Project } from '@/types/project';

// Konfigurasi Caching sesuai Matriks Modul 7:
// staleTime = 5 menit (300.000 ms)
// gcTime = 15 menit (900.000 ms)
const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
};

export function useProjectsQuery() {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    ...CACHE_CONFIG,
  });
}

export function useProjectDetailQuery(id: string) {
  return useQuery<Project, Error>({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id),
    enabled: Boolean(id),
    ...CACHE_CONFIG,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: (newProject: CreateProjectInput) => createProject(newProject),
    onSuccess: () => {
      // Invalidate cache 'projects' agar data sinkron dengan server
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
