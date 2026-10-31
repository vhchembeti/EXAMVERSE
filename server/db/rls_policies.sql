-- server/db/rls_policies.sql
-- Production PostgreSQL DDL Schema with Row-Level Security (RLS) & Envelope Encryption
-- EXAMVERSE Platform: DPDP Act 2023 & OWASP ASVS v4.0 Compliance

-- 1. Create RBAC Roles Enum
CREATE TYPE examverse_user_role AS ENUM (
  'student',
  'moderator',
  'editor',
  'reviewer',
  'admin',
  'super_admin'
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- PBKDF2-SHA512 / Argon2id
  role examverse_user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Student Profiles Table with Envelope-Encrypted PII & HMAC Blind Indexes
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  
  -- Sensitive PII stored strictly as AES-256-GCM Envelope Encryption (DEK wrapped by KEK)
  dob_encrypted JSONB,                 -- { iv, ciphertext, authTag, wrappedDek, kekIv, kekTag }
  caste_category_encrypted JSONB,      -- { iv, ciphertext, authTag, wrappedDek, kekIv, kekTag }
  domicile_state_encrypted JSONB,      -- { iv, ciphertext, authTag, wrappedDek, kekIv, kekTag }
  phone_encrypted JSONB,               -- { iv, ciphertext, authTag, wrappedDek, kekIv, kekTag }

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

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_profile UNIQUE (user_id)
);

-- Indices on Blind Index columns for ultra-fast query performance
CREATE INDEX IF NOT EXISTS idx_student_domicile_bidx ON student_profiles(domicile_state_bidx);
CREATE INDEX IF NOT EXISTS idx_student_caste_bidx ON student_profiles(caste_category_bidx);
CREATE INDEX IF NOT EXISTS idx_student_phone_bidx ON student_profiles(phone_bidx);

-- 4. Daily Targets Table
CREATE TABLE IF NOT EXISTS daily_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  subject VARCHAR(100),
  estimated_minutes INT DEFAULT 30,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Test Attempts Table
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id VARCHAR(100) NOT NULL,
  test_title VARCHAR(255) NOT NULL,
  exam_id VARCHAR(100) NOT NULL,
  score NUMERIC(6, 2) NOT NULL,
  total_marks NUMERIC(6, 2) NOT NULL,
  accuracy NUMERIC(5, 2) NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Cryptographic Hash-Chained Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  prev_hash VARCHAR(64) NOT NULL,
  current_hash VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR STRICT TENANT ISOLATION
-- =========================================================================

-- Enable RLS on all student-facing tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users table isolation
-- A student can only view/update their own user record
CREATE POLICY user_tenant_isolation ON users
  FOR ALL
  USING (id = current_setting('app.current_user_id', true)::uuid);

-- Admins and Super Admins can view user records for compliance
CREATE POLICY admin_user_access ON users
  FOR SELECT
  USING (current_setting('app.current_user_role', true) IN ('admin', 'super_admin'));

-- Policy 2: Student Profiles strict tenant isolation
-- Students can only access their own profile
CREATE POLICY student_profile_isolation ON student_profiles
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

-- Platform Auditors / Super Admins read-only compliance access
CREATE POLICY admin_profile_audit_access ON student_profiles
  FOR SELECT
  USING (current_setting('app.current_user_role', true) IN ('admin', 'super_admin', 'reviewer'));

-- Policy 3: Daily Targets isolation
CREATE POLICY daily_targets_isolation ON daily_targets
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);

-- Policy 4: Test Attempts isolation
CREATE POLICY test_attempts_isolation ON test_attempts
  FOR ALL
  USING (user_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid);
