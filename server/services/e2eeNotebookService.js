// server/services/e2eeNotebookService.js
// Client-Side Zero-Knowledge End-to-End Encrypted (E2EE) Notebook Adapter
// The server stores ONLY { id, ciphertext, iv, salt, iterations, createdAt, updatedAt }.
// Plaintext notes are NEVER transmitted, received, or stored in server memory.

const path = require('path');
const fs = require('fs');

class E2EENotebookService {
  constructor(dbInstance) {
    this.db = dbInstance;
  }

  /**
   * Validates that payload adheres to strict Zero-Knowledge E2EE specifications.
   * Throws an error if any unencrypted plaintext fields are detected.
   * @param {Object} noteRecord
   */
  validateCiphertextPayload(noteRecord) {
    if (!noteRecord || typeof noteRecord !== 'object') {
      throw new Error("Invalid notebook record format.");
    }

    // STRICT ZERO-KNOWLEDGE SECURITY INVARIANT:
    // Reject any payload containing plaintext keys
    const forbiddenPlaintextKeys = ['plaintext', 'title', 'content', 'body', 'notes', 'text'];
    for (const key of forbiddenPlaintextKeys) {
      if (noteRecord[key] !== undefined && typeof noteRecord[key] === 'string' && noteRecord[key].trim().length > 0) {
        throw new Error(`SECURITY POLICY VIOLATION: Plaintext key '${key}' detected. EXAMVERSE E2EE Notebook strictly forbids unencrypted plaintext transmissions.`);
      }
    }

    if (!noteRecord.ciphertext || typeof noteRecord.ciphertext !== 'string') {
      throw new Error("Missing required 'ciphertext' base64 payload.");
    }
    if (!noteRecord.iv || typeof noteRecord.iv !== 'string') {
      throw new Error("Missing required 'iv' (initialization vector) base64 string.");
    }
    if (!noteRecord.salt || typeof noteRecord.salt !== 'string') {
      throw new Error("Missing required 'salt' base64 string.");
    }
  }

  /**
   * Retrieves encrypted note records for a student user.
   */
  getEncryptedNotes(userEmail) {
    const email = (userEmail || 'student@examverse.in').toLowerCase().trim();
    const userProfile = this.db.state.userProfiles && this.db.state.userProfiles[email];
    if (userProfile && userProfile.encryptedNotes) {
      return userProfile.encryptedNotes;
    }
    this.db.state.encryptedNotes = this.db.state.encryptedNotes || [];
    return this.db.state.encryptedNotes;
  }

  /**
   * Saves or updates an encrypted note record.
   */
  saveEncryptedNote(userEmail, noteRecord) {
    this.validateCiphertextPayload(noteRecord);

    const email = (userEmail || 'student@examverse.in').toLowerCase().trim();
    const cleanRecord = {
      id: noteRecord.id || `e2ee-note-${Date.now()}`,
      ciphertext: noteRecord.ciphertext,
      iv: noteRecord.iv,
      salt: noteRecord.salt,
      iterations: noteRecord.iterations || 100000,
      algo: "AES-256-GCM",
      kdf: "PBKDF2-HMAC-SHA256",
      createdAt: noteRecord.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.db.state.userProfiles && this.db.state.userProfiles[email]) {
      this.db.state.userProfiles[email].encryptedNotes = this.db.state.userProfiles[email].encryptedNotes || [];
      const existingIdx = this.db.state.userProfiles[email].encryptedNotes.findIndex(n => n.id === cleanRecord.id);
      if (existingIdx > -1) {
        this.db.state.userProfiles[email].encryptedNotes[existingIdx] = cleanRecord;
      } else {
        this.db.state.userProfiles[email].encryptedNotes.unshift(cleanRecord);
      }
    } else {
      this.db.state.encryptedNotes = this.db.state.encryptedNotes || [];
      const existingIdx = this.db.state.encryptedNotes.findIndex(n => n.id === cleanRecord.id);
      if (existingIdx > -1) {
        this.db.state.encryptedNotes[existingIdx] = cleanRecord;
      } else {
        this.db.state.encryptedNotes.unshift(cleanRecord);
      }
    }

    this.db.saveState();
    return cleanRecord;
  }

  /**
   * Deletes an encrypted note by ID.
   */
  deleteEncryptedNote(userEmail, noteId) {
    const email = (userEmail || 'student@examverse.in').toLowerCase().trim();
    let deleted = false;

    if (this.db.state.userProfiles && this.db.state.userProfiles[email]?.encryptedNotes) {
      const idx = this.db.state.userProfiles[email].encryptedNotes.findIndex(n => n.id === noteId);
      if (idx > -1) {
        this.db.state.userProfiles[email].encryptedNotes.splice(idx, 1);
        deleted = true;
      }
    }

    if (this.db.state.encryptedNotes) {
      const idx = this.db.state.encryptedNotes.findIndex(n => n.id === noteId);
      if (idx > -1) {
        this.db.state.encryptedNotes.splice(idx, 1);
        deleted = true;
      }
    }

    this.db.saveState();
    return { success: deleted, id: noteId };
  }
}

const db = require('../db');
const defaultNotebookService = new E2EENotebookService(db);
defaultNotebookService.E2EENotebookService = E2EENotebookService;

module.exports = defaultNotebookService;
