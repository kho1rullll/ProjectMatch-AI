// types/job.ts — Skema Lowongan Pekerjaan Multi-Platform Sesuai SKPL & Backend Arch
import { z } from 'zod';

export const PlatformSourceEnum = z.enum(['linkedin', 'fiverr', 'upwork', 'manual']);
export type PlatformSource = z.infer<typeof PlatformSourceEnum>;

export const JobTypeEnum = z.enum(['freelance', 'part_time']);
export type JobType = z.infer<typeof JobTypeEnum>;

export const JobStatusEnum = z.enum(['open', 'expired', 'closed']);
export type JobStatus = z.infer<typeof JobStatusEnum>;

export interface ExtractedJobSkills {
  required_skills?: Array<{
    skill: string;
    category: string;
    required_level: number;
  }>;
  radar_requirements?: {
    AI_ML: number;
    Frontend: number;
    Backend: number;
    Database_Cloud: number;
    Software_Architecture: number;
  };
  work_scope?: string;
  estimated_duration?: string;
}

export interface JobVacancy {
  id: string;
  platform_source: PlatformSource;
  external_job_id?: string;
  job_type: JobType;
  title: string;
  company_or_client?: string;
  description: string;
  external_url: string;
  budget_or_salary?: string;
  extracted_skills?: ExtractedJobSkills;
  status: JobStatus;
  processing_status: 'pending' | 'processing' | 'done' | 'failed';
  created_at: string;
  is_bookmarked?: boolean;
  similarity_score?: number;
  match_percentage?: number;
}
