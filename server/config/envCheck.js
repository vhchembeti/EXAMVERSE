// server/config/envCheck.js
// Production Startup Environment & Hardening Validator
// Enforces zero-tolerance configuration checks before server binds to network.

function validateProductionEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = Boolean(process.env.VERCEL);
  const errors = [];
  const warnings = [];

  // Check 1: Database URL in production
  if (isProduction && !isVercel) {
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;
    if (!dbUrl) {
      errors.push(
        'DATABASE_URL or SUPABASE_URL is missing. In production on Render, ephemeral local filesystem cannot persist JSON state across redeploys/spin-downs. A durable PostgreSQL database connection string is required.'
      );
    }
  } else if (isVercel && !process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
    warnings.push('Running on Vercel without DATABASE_URL: Operating in in-memory state mode.');
  }

  // Check 2: ADMIN_SECRET_KEY in production
  if (isProduction && !isVercel) {
    const adminKey = process.env.ADMIN_SECRET_KEY;
    if (!adminKey || adminKey === 'your_secure_admin_secret_key_here' || adminKey.length < 16) {
      errors.push(
        'ADMIN_SECRET_KEY must be a cryptographically secure random string with at least 16 characters in production.'
      );
    }
  }

  // Check 3: Cryptographic Master Key
  const masterKey = process.env.ENCRYPTION_MASTER_KEY || process.env.MASTER_ENCRYPTION_KEY;
  if (isProduction && !isVercel && (!masterKey || masterKey === 'your_256_bit_hex_master_key_here' || masterKey.length < 32)) {
    errors.push(
      'ENCRYPTION_MASTER_KEY must be a valid 256-bit hexadecimal string (at least 32 characters) for DPDP Act 2023 envelope encryption.'
    );
  }

  // Check 4: AI API Keys
  if (!process.env.GEMINI_API_KEY && !process.env.API_KEY && !process.env.GROQ_API_KEY && process.env.ENABLE_OLLAMA !== 'true') {
    warnings.push(
      'No AI provider API key found (GEMINI_API_KEY or GROQ_API_KEY). AI features will operate in deterministic syllabus/CAS fallback mode.'
    );
  }

  // Output warnings
  for (const w of warnings) {
    console.warn(`[ENV WARNING] ${w}`);
  }

  // Fail fast on errors in production
  if (errors.length > 0) {
    console.error('==================================================================');
    console.error('🚨 CRITICAL PRODUCTION CONFIGURATION ERROR(S) DETECTED');
    console.error('==================================================================');
    for (const e of errors) {
      console.error(`❌ ${e}`);
    }
    console.error('==================================================================');
    console.error('Halting startup to prevent insecure or data-loss execution in production.');
    throw new Error(`Production environment validation failed with ${errors.length} error(s).`);
  }

  console.log(`[EnvCheck] Environment validation passed (Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT/TEST'})`);
  return { valid: true, isProduction, warningsCount: warnings.length };
}

module.exports = {
  validateProductionEnv
};
