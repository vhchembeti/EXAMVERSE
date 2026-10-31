# EXAMVERSE Production Deployment & Hosting Manual

**Target Platforms:** Render.com (Zero-Budget Containerized Hosting) / Docker / Supabase PostgreSQL  
**Version:** 2.0.0 (Production Release)  

---

## 1. Prerequisites & Architecture Overview

EXAMVERSE is designed for **zero-friction, zero-budget cloud deployment** on Render.com or any Docker-compatible container host. It serves both the Express API and the pre-compiled Vite React SPA from a single, unprivileged Node 20 runtime.

```
       Candidate Browser / Mobile PWA
                    │
                    ▼ (HTTPS Port 443)
       ┌──────────────────────────────┐
       │   Render.com Web Service     │
       │   (or Docker Container)      │
       │                              │
       │   • React 18 SPA (Vite)      │
       │   • Express REST Backend     │
       │   • ASVS Security Headers    │
       │   • Rate Limiting & Logs     │
       └──────────────┬───────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│ Local Atomic  │ (Default) │ Supabase / PG │ (Optional)
│ JSON Storage  │           │ PostgreSQL DB │
└───────────────┘           └───────────────┘
```

---

## 2. 1-Click Deployment on Render.com

Render supports direct repository deployment using the pre-configured `render.yaml` infrastructure-as-code blueprint.

### Step 1: Connect Your Git Repository
1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Select your GitHub / GitLab repository containing EXAMVERSE.
4. Render will automatically detect `render.yaml`.

### Step 2: Configure Environment Variables
In the Render Blueprint configuration screen, configure the following environment secrets:

| Variable Name | Required | Recommended Value / Description |
| :--- | :--- | :--- |
| `NODE_ENV` | **Yes** | `production` |
| `PORT` | **Yes** | `5000` (or leave default assigned by Render) |
| `ENCRYPTION_MASTER_KEY` | **Yes** | Automatically generated 32-character high-entropy secret. |
| `ADMIN_SECRET_KEY` | **Yes** | Automatically generated admin secret. |
| `BLIND_INDEX_SALT` | **Yes** | High-entropy salt string for HMAC-SHA256 blind indices. |
| `GEMINI_API_KEY` | Optional | Your Google Gemini API key from AI Studio for AI Companion. |
| `GROQ_API_KEY` | Optional | Free-tier Groq API key (fallback cloud LLM). |
| `DATABASE_URL` | Optional | Supabase PostgreSQL URI (if migrating off local JSON engine). |

### Step 3: Trigger Build
Click **Apply**. Render will automatically:
1. Run `npm install && npm run build` (compiling the client React app into `client/dist`).
2. Launch `node server/index.js`.
3. Ping `/api/health` for automated zero-downtime healthcheck verification.

---

## 3. Deploying with Docker / Docker Compose

### Running via Docker Compose
```bash
# 1. Clone repository and copy environment configuration
git clone https://github.com/baswadinesh31-blip/relief-grid.git examverse
cd examverse
cp .env.example .env

# 2. Build and launch container stack (API + SPA + PostgreSQL)
docker compose up -d --build

# 3. Verify health
curl -f http://localhost:5000/api/health
```

### Running Standalone Container
```bash
# Build multi-stage optimized image
docker build -t examverse:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e ENCRYPTION_MASTER_KEY="examverse_master_kek_32bytes_sec_2026!" \
  -e PORT=5000 \
  --name examverse-prod \
  examverse:latest
```

---

## 4. Supabase PostgreSQL Migration (Optional Cloud Scaling)

By default, EXAMVERSE runs on a high-speed atomic JSON persistence engine with automated snapshotting and disaster recovery. To transition to a distributed multi-node database on Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Obtain your PostgreSQL Transaction Connection String:  
   `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
3. Execute the SQL schema migration located in `migrations/schema.sql` or run Prisma:
   ```bash
   npx prisma migrate deploy
   ```
4. Set `DATABASE_URL` in your `.env` or Render dashboard. The storage adapter will automatically route queries to Supabase with Row-Level Security (RLS) policies applied.

---

## 5. Post-Deployment Verification Checklist

Once deployed to production:
- [ ] Ping `GET /api/health` $\rightarrow$ Expect `{ status: "HEALTHY", version: "2.0.0" }`.
- [ ] Check security headers: `curl -I https://your-domain.onrender.com` $\rightarrow$ Confirm `Content-Security-Policy`, `Strict-Transport-Security`, and `X-Content-Type-Options: nosniff`.
- [ ] Visit web portal and verify PWA install prompt / Service Worker registration.
- [ ] Test 1-click personal data export at `/settings/privacy`.
- [ ] Verify rate limiting triggers when making excessive requests from a single client.
