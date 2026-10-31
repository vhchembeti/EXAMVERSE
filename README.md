# EXAMVERSE
> **"Every Exam. Every Opportunity. One Platform."**
> 
> *India's Comprehensive, Intelligent, and Professional Examination Preparation Ecosystem.*

---

## 🏛️ Executive Summary & Project Vision

**EXAMVERSE** is a centralized, human-designed Indian Examination Preparation Ecosystem built to empower millions of students across all 28 Indian States and 8 Union Territories. Instead of navigating fragmented coaching portals, scattered state commission circulars, and unreliable social media rumors, students use EXAMVERSE to discover, verify eligibility for, plan, and prepare for almost every major examination conducted in India.

The platform eliminates guesswork by evaluating statutory eligibility criteria—including category age relaxations, minimum qualification degrees, academic streams, and state domicile rules—while providing a standardized **Universal 19-Section Preparation Dashboard** for every single examination.

Integrated seamlessly into the backend, an **Autonomous AI Monitoring Engine** continuously verifies official recruitment notices, computes SHA-256 checksums of released notifications, and routes announcements through a human-in-the-loop **Admin Verification Queue** before publication. An **AI Academic Study Tutor** (powered by `@google/genai` with *Gemini 3.8 Flash* and a resilient fallback engine) delivers localized, step-by-step doubt resolution in **English, Telugu (తెలుగు), Hindi (हिन्दी), and Tamil (தமிழ்)**.

---

## 🎨 Design Philosophy: Human-Crafted, Professional UI/UX

EXAMVERSE strictly rejects the generic "AI chatbot" homepage aesthetic, dark neon glow effects, and chaotic gradients. It is designed to match the authority, sobriety, and clarity of premier national institutions:

- **Color Palette:** Pure Crisp White background (`#FFFFFF`), Deep Academic Navy (`#0B192C` / `#1E3A8A`), Slate Gray borders and surface fills (`#F8FAFC`, `#E2E8F0`), and Sovereign Emerald accents (`#059669`).
- **Typography:** Structured modern typography featuring *Inter* and *Plus Jakarta Sans* with strict visual hierarchy and readable line heights.
- **Layout:** Balanced multi-column dashboards, persistent navigation headers, intuitive tabbed views, sticky progress meters, and accessible modal overlays.
- **Backend-Driven AI:** Artificial Intelligence operates invisibly in the background to provide precision recommendations, automated verification, and educational explanations without cluttering the interface with gimmicks.

---

## 📋 Comprehensive 12 Examination Categories

EXAMVERSE organizes India's complex examination landscape into 12 dedicated categories:

| Category | Coverage & Conducting Bodies | Key Examinations |
|---|---|---|
| **1. Government Recruitment (Central & State)** | UPSC, SSC, RRB/RRC, IBPS, SBI, RBI, NABARD, SEBI, EPFO, ESIC, India Post, All 28 State PSCs (APPSC, TGPSC, TNPSC, KPSC, Kerala PSC, MPSC, UPPSC, BPSC, etc.), State Police, State Teachers, Forest & Medical Departments. | Civil Services (UPSC CSE), SSC CGL, SSC CHSL, RRB NTPC, State PSC Group 1 & 2. |
| **2. Common Entrance Examinations** | National Testing Agency (NTA), State CET Cells. | CUET UG, CUET PG, JEE Main, JEE Advanced, NEET UG, CLAT, AILET, NATA, NEST, IISER IAT, AP EAPCET, TG EAPCET, MHT CET, KCET, WBJEE. |
| **3. University & Higher Studies** | Central Universities, State Universities, Premier Institutes. *(Dedicated separate dashboards for CUET UG and CUET PG).* | CUET UG, CUET PG, IIT JAM, GATE, University PG Admissions (M.Sc, M.Tech, MBA, MCA, M.A, M.Com, M.Sc Forensic Science). |
| **4. Engineering Entrance Examinations** | IITs, NITs, Central & State Engineering Boards, UPSC ESE. | GATE (branch-wise: CS, ECE, EEE, ME, CE, Chem), JEE Main, JEE Adv, UPSC Engineering Services (ESE), PSU Direct Recruitment via GATE. |
| **5. Management Entrance Examinations** | IIMs, XLRI, AIMA, State CET Cells. | CAT, XAT, MAT, CMAT, SNAP, NMAT, ATMA, AP ICET, TG ICET. |
| **6. Medical & Healthcare Entrance** | NTA, National Board of Examinations (NBE), AIIMS. | NEET UG, NEET PG, INI-CET, MDS, M.Sc Nursing & Allied Health Sciences. |
| **7. Research & Fellowship Examinations** | UGC, CSIR, TIFR, DST, ICMR, DBT. | UGC NET (JRF & Assistant Professor), CSIR UGC NET, GATE, JEST, TIFR GS, NEST, DBT BET, ICMR JRF, ICAR AICE-JRF. |
| **8. Teaching Eligibility Examinations** | CBSE, State School Education Boards, KVS, NVS. | CTET (Paper 1 & Paper 2), KVS PGT/TGT/PRT, NVS Recruitment, DSSSB, State TETs (AP TET, TS TET, TNTET, etc.). |
| **9. Law Entrance Examinations** | Consortium of NLUs, NLU Delhi, State Law Cells. | CLAT UG, CLAT PG, AILET, LSAT India, State LAWCET. |
| **10. Professional Certification Examinations** | Institute of Chartered Accountants of India (ICAI), ICSI, ICMAI. | CA Foundation, CA Intermediate, CA Final, CS Executive/Professional, CMA Foundation/Inter/Final. |
| **11. Defence & Paramilitary Services** | UPSC, Indian Armed Forces, Ministry of Home Affairs. | NDA, CDS, AFCAT, CAPF (AC), Indian Coast Guard, CRPF, BSF, CISF, ITBP, SSB, Assam Rifles, Intelligence Bureau (IB ACIO). |
| **12. International Entrance & Admissions** | ETS, Graduate Management Admission Council (GMAC), British Council, IDP. | GRE General & Subject, GMAT Focus, IELTS Academic, TOEFL iBT, SAT. |

---

## 🌟 Core System Modules & Features

```
                            ┌───────────────────────────────────┐
                            │             EXAMVERSE             │
                            │      Unified Platform Client      │
                            └─────────────────┬─────────────────┘
                                              │
         ┌──────────────────┬─────────────────┼─────────────────┬──────────────────┐
         ▼                  ▼                 ▼                 ▼                  ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐
│  Geographical   ││  Smart Exam     ││  Universal 19-  ││  CBT Mock Test  ││  AI Academic    │
│  Discovery Hub  ││  Finder Engine  ││  Section Prep   ││  Engine & Gaps  ││  Tutor & Plans  │
│ (All-India/State││ (Statutory Rule ││ (Syllabus, PYQ, ││ (Timer, Penalty ││ (English, Telugu│
│  28 States+8 UTs││  Verification)  ││  Cutoffs, Books)││  Diagnosis, Sol)││  Hindi, Tamil)  │
└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘
         ▲                  ▲                 ▲                 ▲                  ▲
         └──────────────────┴─────────────────┼─────────────────┴──────────────────┘
                                              │
                            ┌─────────────────┴─────────────────┐
                            │    EXAMVERSE Express REST API     │
                            │      Node.js & SQLite/Postgres    │
                            └─────────────────┬─────────────────┘
                                              │
         ┌────────────────────────────────────┴────────────────────────────────────┐
         ▼                                                                         ▼
┌─────────────────────────────────┐                       ┌─────────────────────────────────┐
│ AI Notification Scanner Daemon  │                       │ Google Gemini AI SDK Service    │
│ (Checksums, Corrigendum Alerts, │                       │ (Multilingual Academic Tutor &  │
│  Admin Verification Queue)      │                       │  Dynamic Study Plan Architect)  │
└─────────────────────────────────┘                       └─────────────────────────────────┘
```

### 1. Geographical Examination Discovery: All-India vs. My State
- **My State Selector:** Complete support for all **28 Indian States and 8 Union Territories**.
- Selecting a state dynamically surfaces state-specific Public Service Commissions (e.g. APPSC for Andhra Pradesh, TNPSC for Tamil Nadu, TGPSC for Telangana, KPSC for Karnataka, UPPSC for Uttar Pradesh), State CETs, Police Recruitment Boards, and State Universities.
- **All India View:** Displays national exams while preserving non-domicile eligibility across neighboring states (e.g. an Andhra Pradesh student can easily inspect open General quota vacancies in Tamil Nadu or Telangana).

### 2. Smart Examination Finder & Eligibility Engine
- Deterministic verification engine evaluating:
  - **Date of Birth & Age Constraints:** Computes exact age with statutory category relaxations (OBC: +3 years, SC/ST: +5 years, PwD: +10 years).
  - **Educational Qualification & Degree Stream:** Matches exact degrees (B.Tech, B.Sc, B.Com, MBBS, BA, etc.) and specializations (Computer Science, Forensic Science, Life Sciences, Mechanical, etc.).
  - **Graduation Status:** Automatically accounts for "Final Year Appearing / Pursuing" eligibility rules (e.g. GATE allows 3rd & 4th year students; UPSC CSE allows final year students).
  - **Domicile & Reservation Rules:** Distinguishes between Open/All-India quotas and State-Domicile-only posts.
- **Three Clear Status Classifications:**
  - `ELIGIBLE` (with exact qualifying criteria enumerated).
  - `NOT_ELIGIBLE` (with specific unmet requirements, e.g. age excess or stream mismatch).
  - `VERIFICATION_REQUIRED` (e.g. subject combinations in 10+2 or university accreditation).

### 3. Universal 19-Section Examination Preparation System
Every examination in the directory features a standardized, distraction-free preparation portal covering:
1. **Exam Overview & Conducting Authority:** Official contact, headquarters, and exam mandate.
2. **Statutory Eligibility Criteria:** Nationality, age limits, and reservations.
3. **Age Limits & Relaxation Calculator:** Real-time birthday checker against the official cutoff date.
4. **Educational Qualifications:** Degree mapping and minimum percentage benchmarks.
5. **Stages of Selection:** Prelims screening, Mains written, Physical/Medical endurance, and Personality Interview.
6. **Detailed Examination Pattern:** Sectional marks, total time, medium of paper, and question formats.
7. **Official Syllabus (Topic-wise):** Comprehensive chapter breakdown with weightage flags.
8. **Previous Years' Cutoff Marks:** Multi-year cutoff tables segmented by General, OBC, EWS, SC, ST, and PwD.
9. **Score Gap Calculator:** Computes the exact delta between a student's mock marks and last year's cutoff.
10. **Previous Year Question Papers (PYQs):** Year-by-year downloadable question papers with answer keys.
11. **Standard Reference Books & Authors:** Recommended books (e.g. Laxmikanth, NCERTs, RS Aggarwal, standard engineering texts).
12. **Free Curated Video Lectures:** Subject-wise YouTube and official SWAYAM/NPTEL lecture playlists.
13. **Daily Practice Questions (DPQs):** Daily concept quizzes.
14. **Weekly Mock Test Series:** Timed sectional and full-length simulated exams.
15. **Toppers' Preparation Strategies:** Proven timetables, revision techniques, and booklists.
16. **Official Notifications & Corrigendums:** Verified gazette notifications with SHA-256 validation.
17. **Important Dates & Calendar:** Confirmed and tentative schedules.
18. **AI Personal Academic Study Assistant:** Context-aware academic doubt resolution.
19. **Student Preparation Tracker:** Personal syllabus completion percentage and mock score analytics.

### 4. Interactive CBT Mock Test Engine & Diagnostics
- Simulated Computer-Based Test (CBT) environment.
- Countdown timer with auto-submit safeguard on timeout.
- Interactive question palette (Answered, Unanswered, Marked for Review).
- **Statutory Negative Marking:** Implements official penalty rules (e.g. $-0.66$ for UPSC Prelims; $-0.25$ for SSC/Banking; $-1.0$ for NEET).
- **Instant Diagnostic Breakdown:** Identifies strong topics, weak conceptual areas, accuracy percentage, and displays step-by-step solutions for every question.

### 5. AI Study Tutor, Study Planner & Performance Analyst
- Powered by `@google/genai` (*gemini-3.8-flash*) with a 3.5s resilient circuit-breaker and structured educational fallback.
- **Multilingual Doubt Solving:** Full pedagogical explanations in **English, Telugu (తెలుగు), Hindi (हिन्दी), and Tamil (தமிழ்)**.
- **Quantitative & Reasoning Derivations:** Step-by-step mathematical breakdowns including competitive speed shortcuts and elimination tricks.
- **Personalized Study Planner:** Generates day-by-day and phase-by-phase study timetables based on target days, daily study hours, and diagnosed weak subjects.

### 6. Automated AI Notification Monitoring Service & Admin Queue
- Automated background crawler targeting 7+ official recruitment portals (UPSC, SSC, NTA, IBPS, APPSC, TGPSC, TNPSC).
- Computes SHA-256 checksums of released notification documents.
- Automatically flags date extensions, syllabus changes, and new vacancies.
- **Admin Verification Queue:** New announcements are placed in a verification queue where human administrators verify document hashes and official gazette URLs before the update is pushed to live student dashboards.

### 7. Dual / Multi-Career Path Finder
- Comprehensive career pathway mapping for students and graduates:
  - **B.Tech / B.E. (Computer Science / IT / Core):** Maps GATE PSU appointments (IOCL, NTPC, ISRO, BARC, DRDO), Central Technical Cadres (RRB JE, SSC JE, NIC), Civil Services, Banking Specialist IT Officers, M.Tech/MS at IISc/IITs, and Top-Tier MBAs.
  - **B.Sc Forensic Science:** Maps Central & State Forensic Science Laboratories (CFSL, SFSL, RFSL), CBI/IB Intelligence & Crime Scene Units, CUET PG / NFSU Master's programs, and UPSC/SSC executive posts.
  - **B.Sc Life Sciences / B.Com / Arts:** Tailored dual pathways for research fellowships (CSIR NET, IIT JAM) vs executive government posts.

---

## 🗄️ Database Architecture & Schema (`schema.sql`)

EXAMVERSE features a production-ready relational schema (compatible with PostgreSQL, Supabase, and SQLite) comprising 22+ tables:

```sql
-- Core Schema Architecture Summary
users                         -- Authentication and system roles (student, educator, admin)
student_profiles              -- Multi-attribute student demographic, qualification, and state profile
states_ut                     -- All 28 States and 8 Union Territories with recruitment portals
examinations                  -- Comprehensive exam catalog across all 12 categories
exam_eligibility_criteria     -- Exact age limits, category relaxations, and educational rules
exam_patterns                 -- Detailed sectional structure, question counts, and negative marking
exam_syllabi                  -- Module-wise official syllabus topics and weightage
exam_cutoffs                  -- Multi-year historical cutoffs categorized by reservation quotas
exam_pyqs                     -- Previous year question papers, solutions, and official answer keys
exam_recommended_books        -- Standard reference textbooks, authors, and purchase/library links
exam_video_lectures           -- Curated playlists from certified educators and national portals
mock_tests                    -- CBT practice exams with timing and marking specifications
mock_questions                -- Questions, multi-choice options, correct answers, and explanations
student_mock_attempts         -- Test scores, negative penalties, time taken, and topic diagnostics
daily_study_targets           -- Personalized student daily checklist items and completion states
study_plans                   -- AI-generated multi-week preparation plans
career_pathways               -- Degree mappings to Job Opportunities vs Higher Studies & Research
official_notifications        -- Verified public notifications with status lifecycle
notification_monitoring_sources -- Monitored official state and central portal URLs
admin_verification_queue      -- Staging queue for newly detected notification checksums
audit_logs                    -- Immutable system audit trail for security and transparency
```

The full DDL definitions with foreign keys, checks, and performance indexes are provided in [`schema.sql`](./schema.sql).

---

## 🔌 REST API Specification

The EXAMVERSE backend exposes a clean REST API on port `5000`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend operational status, service name, and timestamp. |
| `POST` | `/api/auth/register` | Registers a new student account and initializes their profile. |
| `POST` | `/api/auth/login` | Authenticates existing user and returns their session profile. |
| `GET` | `/api/student/profile` | Fetches active student profile (DOB, State, Category, Degree, Stream). |
| `PUT` | `/api/student/profile` | Updates student profile attributes and records an audit log. |
| `GET` | `/api/states` | Returns list of all 28 Indian States & 8 UTs with local boards. |
| `GET` | `/api/states/:code` | Returns detailed recruitment boards and CETs for a specific state. |
| `GET` | `/api/exams` | Returns all examinations with optional `?category=`, `?state=`, `?scope=`. |
| `GET` | `/api/exams/:id` | Returns complete 19-section data for an exam with personalized eligibility. |
| `POST` | `/api/eligibility/check` | Evaluates a student profile against all exams; returns `ELIGIBLE`, `NOT_ELIGIBLE`, or `VERIFICATION_REQUIRED`. |
| `GET` | `/api/notifications` | Returns all official notifications with status filters (`ACTIVE`, `CLOSING_SOON`, `UPCOMING`, `RESULT_DECLARED`). |
| `GET` | `/api/notifications/active` | Returns active notifications and unread count for the global bell popup. |
| `POST` | `/api/notifications/:id/read` | Marks a specific notification as read for the student. |
| `GET` | `/api/calendar` | Returns confirmed and tentative examination events. |
| `GET` | `/api/mock-tests` | Returns list of available CBT mock tests. |
| `GET` | `/api/mock-tests/:id` | Returns mock test questions (without answers) for exam taking. |
| `POST` | `/api/mock-tests/:id/submit` | Evaluates user answers with negative marking; returns score, accuracy, and topic diagnostics. |
| `GET` | `/api/mock-tests/attempts/history` | Returns historical student mock test attempts. |
| `GET` | `/api/planner/daily-targets` | Fetches current daily study target checklist. |
| `POST` | `/api/planner/daily-targets/:id/toggle` | Toggles completion status of a daily target. |
| `POST` | `/api/planner/daily-targets` | Creates a new custom daily study target. |
| `POST` | `/api/cutoffs/gap-analysis` | Computes score gap between student expected score and historical cutoff. |
| `POST` | `/api/ai/tutor` | Multilingual AI academic tutor doubt resolution (English, Telugu, Hindi, Tamil). |
| `POST` | `/api/ai/study-plan` | Generates a custom day-by-day preparation roadmap. |
| `POST` | `/api/ai/performance-analysis` | Evaluates recent mock tests and recommends tactical focus areas. |
| `GET` | `/api/monitoring/status` | Returns active web crawling feeds and pending admin queue items. |
| `POST` | `/api/monitoring/scan` | Manually triggers an automated portal checksum scan. |
| `POST` | `/api/monitoring/verify` | Approves or rejects a newly detected notification (Admin). |
| `GET` | `/api/career-paths` | Returns career pathways for all supported academic qualifications. |
| `GET` | `/api/career-paths/:id` | Returns dual pathway details (Jobs vs Higher Studies) for a qualification. |
| `GET` | `/api/admin/overview` | Returns system-wide metrics, active feeds, and audit trail. |

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended).
- **npm:** v9.0.0 or higher.
- *(Optional)* **Google Gemini API Key:** For live Gemini 3.8 Flash inference. If omitted, the integrated multilingual academic engine takes over seamlessly without interruption.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/examverse.git
cd examverse

# Install root & server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Variables Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Build the Frontend Production Bundle

```bash
cd client
npm run build
cd ..
```

### 4. Run the Full-Stack Application

```bash
# Start backend server (serves REST API and compiled frontend)
node server/index.js
```

Open your browser at **`http://localhost:5000`** to experience EXAMVERSE.

For development with Vite Hot Module Replacement (HMR):
```bash
# Terminal 1: Backend API
node server/index.js

# Terminal 2: Vite Dev Server
cd client
npm run dev
```

---

## 🌐 Production Deployment Guide

### Deployment Option 1: Single-Service Monolith (Render / Railway / Fly.io)
1. Set Build Command: `cd client && npm install && npm run build && cd .. && npm install`
2. Set Start Command: `node server/index.js`
3. Environment Variables:
   - `PORT`: `5000` (or dynamic host port `$PORT`)
   - `GEMINI_API_KEY`: Your Google GenAI API Key

### Deployment Option 2: Decoupled (Vercel Frontend + Render/Railway Backend)
1. **Frontend (Vercel):**
   - Root directory: `client`
   - Framework preset: `Vite`
   - Output directory: `dist`
   - Set environment variable: `VITE_API_URL=https://your-backend-service.onrender.com/api`
2. **Backend (Render / Railway):**
   - Root directory: `server`
   - Command: `node index.js`
   - Ensure CORS is configured for your Vercel domain.

### Deployment Option 3: Docker Containerization
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY client/package*.json ./client/
RUN cd client && npm install
COPY . .
RUN cd client && npm run build
EXPOSE 5000
CMD ["node", "server/index.js"]
```

---

## 🔒 Security, Compliance & Data Integrity

- **Statutory Grounding:** EXAMVERSE never hallucinates cutoff marks or examination schedules. All default examination calendars, eligibility age brackets, and syllabi are grounded in official notifications from constitutional commissions (UPSC, State PSCs, NTA, CBSE).
- **Checksum Verification:** Every newly detected notification must produce a valid SHA-256 hash matching the official portal release before publication.
- **Privacy Protection:** Personal student information (Date of Birth, category, reservation status, and mock scores) is kept strictly isolated and never transmitted to third-party ad networks.

---

## 📄 License

This project is licensed under the **MIT License**.

---

*EXAMVERSE — Every Exam. Every Opportunity. One Platform.*
