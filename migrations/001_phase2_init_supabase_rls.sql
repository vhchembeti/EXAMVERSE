-- migrations/001_phase2_init_supabase_rls.sql
-- Supabase PostgreSQL Migration for EXAMVERSE Platform
-- Supports Row-Level Security (RLS), AES-256-GCM Envelope Encrypted PII,
-- Deterministic HMAC-SHA256 Blind Indexing, and DPDP Act 2023 Compliance.

-- Enable pgcrypto for UUID and cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. RBAC Roles Definition
DO $$ BEGIN
  CREATE TYPE examverse_user_role AS ENUM (
    'student',
    'moderator',
    'editor',
    'reviewer',
    'admin',
    'super_admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role examverse_user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Student Profiles Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,

  -- Sensitive PII stored strictly as AES-256-GCM Envelope Envelopes (DEK wrapped by KEK)
  dob_encrypted JSONB,
  caste_category_encrypted JSONB,
  domicile_state_encrypted JSONB,
  phone_encrypted JSONB,

  -- Deterministic HMAC-SHA256 Blind Indexes for Exact-Match Queries Without Decryption
  domicile_state_bidx VARCHAR(64),
  caste_category_bidx VARCHAR(64),
  phone_bidx VARCHAR(64),

  -- Non-Sensitive Academic & Preference Attributes
  educational_qualification VARCHAR(100),
  degree VARCHAR(100),
  specialization VARCHAR(150),
  university VARCHAR(255),
  graduation_status VARCHAR(50),
  passing_year INT,
  preferred_language VARCHAR(50) DEFAULT 'English',
  preparation_level VARCHAR(50) DEFAULT 'Intermediate',
  career_interests TEXT[],
  is_pwd BOOLEAN DEFAULT FALSE,
  is_ex_serviceman BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unq_user_profile UNIQUE (user_id)
);

-- Indexing on Blind Indexes
CREATE INDEX IF NOT EXISTS idx_supabase_domicile_bidx ON public.student_profiles(domicile_state_bidx);
CREATE INDEX IF NOT EXISTS idx_supabase_caste_bidx ON public.student_profiles(caste_category_bidx);
CREATE INDEX IF NOT EXISTS idx_supabase_phone_bidx ON public.student_profiles(phone_bidx);

-- 4. Daily Targets Table
CREATE TABLE IF NOT EXISTS public.daily_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  subject VARCHAR(100),
  estimated_minutes INT DEFAULT 30,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Mock Test Attempts Table
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  test_id VARCHAR(100) NOT NULL,
  test_title VARCHAR(255) NOT NULL,
  exam_id VARCHAR(100) NOT NULL,
  score NUMERIC(6, 2) NOT NULL,
  total_marks NUMERIC(6, 2) NOT NULL,
  accuracy NUMERIC(5, 2) NOT NULL,
  time_taken_seconds INT DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Cryptographic Hash-Chained Audit Trail
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  prev_hash VARCHAR(64) NOT NULL,
  current_hash VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================================
-- SUPABASE ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Student Profiles Isolation
CREATE POLICY "Student Profile Self Access"
  ON public.student_profiles
  FOR ALL
  USING (auth.uid() = user_id OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid)
  WITH CHECK (auth.uid() = user_id OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid);

CREATE POLICY "Admin Profile Audit Access"
  ON public.student_profiles
  FOR SELECT
  USING (
    COALESCE(current_setting('app.current_user_role', true), '') IN ('admin', 'super_admin', 'reviewer')
  );

-- 2. Daily Targets Isolation
CREATE POLICY "Daily Targets Self Access"
  ON public.daily_targets
  FOR ALL
  USING (auth.uid() = user_id OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid)
  WITH CHECK (auth.uid() = user_id OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid);

-- 3. Test Attempts Isolation
CREATE POLICY "Test Attempts Self Access"
  ON public.test_attempts
  FOR ALL
  USING (auth.uid() = user_id OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid)
  WITH CHECK (auth.uid() = user_id OR user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid);

-- 4. Audit Logs Read-Only for Compliance
CREATE POLICY "Audit Logs Admin Read Only"
  ON public.audit_logs
  FOR SELECT
  USING (COALESCE(current_setting('app.current_user_role', true), '') IN ('admin', 'super_admin'));
