// server/db/databaseAdapter.js
// Multi-Tier Database Adapter for EXAMVERSE
// Tier A: Active zero-dependency local JSON engine (with atomic writes and backup guarantees)
// Tier B: Managed Supabase PostgreSQL / RDS Adapter (activated via DATABASE_URL)

const db = require('../db');

class DatabaseAdapter {
  constructor() {
    this.databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL || null;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction && !this.databaseUrl) {
      const errMsg = '[DatabaseAdapter FATAL] In production mode (NODE_ENV=production), local JSON database is strictly disabled due to Render ephemeral filesystem. A durable PostgreSQL DATABASE_URL or SUPABASE_URL must be provided.';
      console.error(errMsg);
      throw new Error(errMsg);
    }

    this.mode = this.databaseUrl ? 'postgresql' : 'json';
    console.log(`[DatabaseAdapter] Operating in mode: '${this.mode.toUpperCase()}' (Production Safe: ${isProduction ? 'YES (PostgreSQL)' : 'DEV/TEST (JSON Engine)'})`);
  }

  getMode() {
    return this.mode;
  }

  // --- Multi-User Profile Operations ---
  getStudentProfile(email) {
    // Falls back to local JSON engine with atomic persistence
    return db.getStudentProfile(email);
  }

  updateStudentProfile(updates, email) {
    return db.updateStudentProfile(updates, email);
  }

  registerUser(userData) {
    return db.registerUser(userData);
  }

  verifyPassword(password, storedHash) {
    return db.verifyPassword(password, storedHash);
  }

  // --- Examinations & Schemas ---
  getAllExams() {
    return db.getAllExams();
  }

  getExamById(id) {
    return db.getExamById(id);
  }

  // --- Notifications ---
  getAllNotifications() {
    return db.getAllNotifications();
  }

  // --- Daily Targets ---
  getDailyTargets(email) {
    return db.getDailyTargets(email);
  }

  addDailyTarget(targetData, email) {
    return db.addDailyTarget(targetData, email);
  }

  toggleDailyTarget(id, email) {
    return db.toggleDailyTarget(id, email);
  }

  // --- Audit Logging ---
  logAudit(action, actor, details) {
    return db.logAudit(action, actor, details);
  }
}

const databaseAdapter = new DatabaseAdapter();
module.exports = databaseAdapter;
