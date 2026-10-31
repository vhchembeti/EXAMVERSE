-- =========================================================================
-- EXAMVERSE: Indian Examination Preparation Ecosystem
-- Production Relational Schema (PostgreSQL 15+ / Supabase Compatible)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STATES AND UNION TERRITORIES
CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('State', 'Union Territory')),
    capital VARCHAR(100) NOT NULL,
    official_language VARCHAR(100),
    domicile_rules TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. RECRUITMENT BOARDS & AUTHORITIES
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) CHECK (org_type IN ('Central Recruitment', 'State PSC', 'National Entrance', 'Banking', 'Defence', 'University')),
    state_code VARCHAR(10) REFERENCES states(code) ON DELETE SET NULL,
    official_website VARCHAR(255) NOT NULL,
    notification_portal_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer Not to Say')),
    state_code VARCHAR(10) REFERENCES states(code),
    district VARCHAR(100),
    educational_qualification VARCHAR(100) NOT NULL,
    degree VARCHAR(100),
    specialization VARCHAR(150),
    graduation_status VARCHAR(50) CHECK (graduation_status IN ('Completed', 'Final Year', 'Pursuing')),
    category VARCHAR(50) DEFAULT 'General' CHECK (category IN ('General', 'OBC', 'SC', 'ST', 'EWS', 'PwD')),
    preferred_language VARCHAR(50) DEFAULT 'English' CHECK (preferred_language IN ('English', 'Telugu', 'Hindi', 'Tamil')),
    preparation_level VARCHAR(50) DEFAULT 'Intermediate' CHECK (preparation_level IN ('Beginner', 'Intermediate', 'Advanced')),
    career_interests TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. EXAMINATIONS DIRECTORY
CREATE TABLE IF NOT EXISTS examinations (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    scope VARCHAR(50) NOT NULL CHECK (scope IN ('All India', 'State', 'International')),
    state_code VARCHAR(10) REFERENCES states(code),
    frequency VARCHAR(50),
    mode VARCHAR(50),
    short_description TEXT,
    official_website VARCHAR(255),
    official_notification_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ELIGIBILITY RULES
CREATE TABLE IF NOT EXISTS eligibility_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    min_age INT,
    max_age INT,
    age_relaxation_obc INT DEFAULT 3,
    age_relaxation_sc_st INT DEFAULT 5,
    age_relaxation_pwd INT DEFAULT 10,
    min_qualification VARCHAR(100) NOT NULL,
    allowed_degrees TEXT[],
    specializations TEXT[],
    min_percentage NUMERIC(5, 2),
    final_year_eligible BOOLEAN DEFAULT TRUE,
    domicile_rule TEXT,
    nationality VARCHAR(100) DEFAULT 'Indian',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. OFFICIAL NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    organization_code VARCHAR(50) NOT NULL,
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE SET NULL,
    exam_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'CLOSING_SOON', 'UPCOMING', 'CLOSED', 'RESULT_DECLARED')),
    release_date DATE NOT NULL,
    application_start_date DATE,
    last_date DATE,
    exam_date DATE,
    official_link VARCHAR(255) NOT NULL,
    pdf_link VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code),
    total_vacancies INT,
    summary TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EXAM CALENDARS
CREATE TABLE IF NOT EXISTS exam_calendars (
    id VARCHAR(100) PRIMARY KEY,
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    organization_code VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code),
    status VARCHAR(50) NOT NULL CHECK (status IN ('CONFIRMED', 'TENTATIVE', 'NOT_ANNOUNCED')),
    notification_date DATE,
    application_start DATE,
    application_last_date DATE,
    admit_card_date DATE,
    exam_date DATE,
    result_date DATE,
    color VARCHAR(20) DEFAULT '#1E3A8A',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SYLLABUS SUBJECTS & TOPICS
CREATE TABLE IF NOT EXISTS syllabus_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    subject_name VARCHAR(150) NOT NULL,
    weightage_percent NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS syllabus_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES syllabus_subjects(id) ON DELETE CASCADE,
    topic_name VARCHAR(200) NOT NULL,
    subtopics TEXT[],
    importance_level VARCHAR(20) CHECK (importance_level IN ('High', 'Medium', 'Low'))
);

-- 10. PREVIOUS YEAR QUESTION PAPERS
CREATE TABLE IF NOT EXISTS question_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    year INT NOT NULL,
    tier VARCHAR(50),
    subject VARCHAR(150),
    shift VARCHAR(50),
    language VARCHAR(50) DEFAULT 'English',
    pdf_url VARCHAR(255),
    has_online_practice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. RECOMMENDED BOOKS
CREATE TABLE IF NOT EXISTS recommended_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    edition VARCHAR(100),
    reference_link VARCHAR(255),
    purchase_link VARCHAR(255)
);

-- 12. VIDEO RESOURCES
CREATE TABLE IF NOT EXISTS video_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    channel_name VARCHAR(150),
    topic VARCHAR(150),
    youtube_url VARCHAR(255) NOT NULL,
    duration VARCHAR(50)
);

-- 13. MOCK TESTS & QUESTIONS
CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(100) PRIMARY KEY,
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    subject VARCHAR(100),
    total_questions INT NOT NULL,
    time_limit_minutes INT NOT NULL,
    total_marks NUMERIC(6, 2) NOT NULL,
    positive_marks NUMERIC(4, 2) NOT NULL,
    negative_marks NUMERIC(4, 2) NOT NULL,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_test_id VARCHAR(100) REFERENCES mock_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of string options
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard'))
);

-- 14. STUDENT TEST ATTEMPTS & PERFORMANCE ANALYTICS
CREATE TABLE IF NOT EXISTS student_attempts (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id VARCHAR(100) REFERENCES mock_tests(id),
    score NUMERIC(6, 2) NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL,
    incorrect_count INT NOT NULL,
    unattempted_count INT NOT NULL,
    time_taken_seconds INT NOT NULL,
    subject_scores JSONB,
    weak_topics TEXT[],
    strong_topics TEXT[],
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. DAILY TARGETS & STUDY PLANS
CREATE TABLE IF NOT EXISTS daily_targets (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_text TEXT NOT NULL,
    subject VARCHAR(100),
    estimated_minutes INT DEFAULT 30,
    is_completed BOOLEAN DEFAULT FALSE,
    target_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_id VARCHAR(100) REFERENCES examinations(id),
    target_days INT NOT NULL,
    daily_hours NUMERIC(3, 1) NOT NULL,
    preparation_level VARCHAR(50),
    plan_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. USER BOOKMARKS & SELECTED EXAMS
CREATE TABLE IF NOT EXISTS student_selected_exams (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, exam_id)
);

CREATE TABLE IF NOT EXISTS saved_materials (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_id VARCHAR(100) REFERENCES examinations(id) ON DELETE CASCADE,
    material_type VARCHAR(50) CHECK (material_type IN ('PYQ', 'Book', 'Video', 'Note', 'Syllabus')),
    title VARCHAR(255) NOT NULL,
    saved_at DATE DEFAULT CURRENT_DATE
);

-- 17. AI TUTOR CONVERSATIONS
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_id VARCHAR(100) REFERENCES examinations(id),
    language VARCHAR(50) DEFAULT 'English',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    model_used VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. NOTIFICATION MONITORING & ADMIN AUDIT
CREATE TABLE IF NOT EXISTS monitoring_queue (
    id VARCHAR(100) PRIMARY KEY,
    organization VARCHAR(50) NOT NULL,
    exam_title VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    official_source_url VARCHAR(255) NOT NULL,
    source_document_url VARCHAR(255),
    document_checksum VARCHAR(100),
    extracted_data JSONB,
    changes_detected TEXT,
    ai_confidence_score NUMERIC(4, 2),
    verification_status VARCHAR(50) DEFAULT 'PENDING_ADMIN_REVIEW' CHECK (verification_status IN ('PENDING_ADMIN_REVIEW', 'APPROVED', 'REJECTED')),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    user_identifier VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning performance
CREATE INDEX IF NOT EXISTS idx_exams_category ON examinations(category);
CREATE INDEX IF NOT EXISTS idx_exams_scope ON examinations(scope);
CREATE INDEX IF NOT EXISTS idx_notifs_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifs_release_date ON notifications(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_exam_date ON exam_calendars(exam_date);
CREATE INDEX IF NOT EXISTS idx_daily_targets_user ON daily_targets(user_id, target_date);
