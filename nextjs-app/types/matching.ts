// types/matching.ts — Skema Hasil Pencocokan Semantik & Radar Chart (FR-06, FR-07)
import { JobVacancy } from './job';

export interface SkillRadarScore {
  skill: string;
  student_score: number;
  required_score: number;
  description?: string;
}

export interface MatchDetail {
  match_id: string;
  job_id: string;
  job_title: string;
  company?: string;
  platform_source: string;
  external_url: string;
  similarity_score: number;
  match_percentage: number;
  score_breakdown: SkillRadarScore[];
  summary_reason?: string;
}

export interface RecommendationItem {
  job: JobVacancy;
  similarity_score: number;
  match_percentage: number;
  score_breakdown?: SkillRadarScore[];
}
