-- =============================================================================
-- ProjectMatch AI: Database Schema Definition (DDL)
-- Reference: SKPL Bab VI & Laporan Arsitektur Backend Bab 12
-- Target: PostgreSQL 15+ dengan ekstensi pgvector 0.5+
-- =============================================================================

-- 0. Ekstensi pgvector untuk pencarian kemiripan vektor semantik
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tipe ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('mahasiswa', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE processing_status_enum AS ENUM ('pending', 'processing', 'done', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE platform_source_enum AS ENUM ('linkedin', 'fiverr', 'upwork', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_type_enum AS ENUM ('freelance', 'part_time');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status_enum AS ENUM ('open', 'expired', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM ('match_result', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Trigger function untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. TABEL users (FR-01, FR-11)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'mahasiswa',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. TABEL mahasiswa_profiles (FR-02, FR-03)
-- =============================================================================
CREATE TABLE IF NOT EXISTS mahasiswa_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    nim VARCHAR(20) UNIQUE NOT NULL,
    program_studi VARCHAR(100),
    angkatan SMALLINT,
    github_username VARCHAR(100) UNIQUE NOT NULL,
    github_data JSONB,
    extracted_skills JSONB,
    processing_status processing_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_mahasiswa_profiles_updated_at
BEFORE UPDATE ON mahasiswa_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 3. TABEL job_vacancies (FR-04, FR-05, FR-10)
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_source platform_source_enum NOT NULL,
    external_job_id VARCHAR(150),
    job_type job_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    company_or_client VARCHAR(150),
    description TEXT NOT NULL,
    external_url TEXT NOT NULL,
    budget_or_salary VARCHAR(100),
    extracted_skills JSONB,
    status job_status_enum NOT NULL DEFAULT 'open',
    processing_status processing_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_platform_external_job UNIQUE (platform_source, external_job_id)
);

CREATE TRIGGER update_job_vacancies_updated_at
BEFORE UPDATE ON job_vacancies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. TABEL embeddings (FR-03, FR-05, FR-06)
-- Sentence Transformers (384 Dimensi), indeks HNSW dengan cosine similarity
-- =============================================================================
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID UNIQUE REFERENCES mahasiswa_profiles(id) ON DELETE CASCADE,
    job_vacancy_id UUID UNIQUE REFERENCES job_vacancies(id) ON DELETE CASCADE,
    embedding_vector VECTOR(384) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_embedding_owner CHECK (
        (mahasiswa_id IS NOT NULL AND job_vacancy_id IS NULL) OR
        (mahasiswa_id IS NULL AND job_vacancy_id IS NOT NULL)
    )
);

CREATE TRIGGER update_embeddings_updated_at
BEFORE UPDATE ON embeddings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indeks HNSW pgvector untuk cosine similarity search
CREATE INDEX IF NOT EXISTS idx_embeddings_vector_hnsw 
ON embeddings USING hnsw (embedding_vector vector_cosine_ops);

-- =============================================================================
-- 5. TABEL matches (FR-06, FR-07)
-- =============================================================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID NOT NULL REFERENCES mahasiswa_profiles(id) ON DELETE CASCADE,
    job_vacancy_id UUID NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
    similarity_score DOUBLE PRECISION NOT NULL CHECK (similarity_score >= 0.0 AND similarity_score <= 1.0),
    score_breakdown JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_match_pair UNIQUE (mahasiswa_id, job_vacancy_id)
);

CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 6. TABEL job_bookmarks (FR-08)
-- Menggantikan lamaran internal mahasiswa
-- =============================================================================
CREATE TABLE IF NOT EXISTS job_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID NOT NULL REFERENCES mahasiswa_profiles(id) ON DELETE CASCADE,
    job_vacancy_id UUID NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bookmark_pair UNIQUE (mahasiswa_id, job_vacancy_id)
);

-- =============================================================================
-- 7. TABEL notifications (FR-09)
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Indeks performa
CREATE INDEX IF NOT EXISTS idx_jobs_status_platform ON job_vacancies (status, platform_source);
CREATE INDEX IF NOT EXISTS idx_matches_mahasiswa_score ON matches (mahasiswa_id, similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, is_read);
