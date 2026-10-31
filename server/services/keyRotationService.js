// server/services/keyRotationService.js
// Enterprise Envelope Key Rotation Utility (OWASP ASVS v4.0 Level 2 / NIST SP 800-57)
// Re-wraps Data Encryption Keys (DEKs) under a new Master Key (KEK) without decrypting plaintext data.

const crypto = require('crypto');

class KeyRotationService {
  /**
   * Hashes a key string into a 256-bit Buffer if not already a 32-byte Buffer
   */
  normalizeKek(kekInput) {
    if (Buffer.isBuffer(kekInput) && kekInput.length === 32) {
      return kekInput;
    }
    return crypto.createHash('sha256').update(String(kekInput)).digest();
  }

  /**
   * Generates a key fingerprint for audit logging (SHA-256 first 8 bytes hex)
   */
  getFingerprint(kek) {
    const norm = this.normalizeKek(kek);
    return crypto.createHash('sha256').update(norm).digest('hex').slice(0, 16);
  }

  /**
   * Re-wraps an individual envelope's DEK from old KEK to new KEK
   * @param {Object} envelope - Existing envelope { wrappedDek, kekIv, kekTag, ciphertext, iv, authTag, ... }
   * @param {string|Buffer} oldKek - Existing Master Key
   * @param {string|Buffer} newKek - New Master Key
   * @returns {Object} Updated envelope with re-wrapped DEK
   */
  rewrapEnvelope(envelope, oldKek, newKek) {
    if (!envelope || typeof envelope !== 'object' || !envelope.wrappedDek) {
      return envelope; // Not an envelope or plaintext
    }

    const normOldKek = this.normalizeKek(oldKek);
    const normNewKek = this.normalizeKek(newKek);

    // 1. Unwrap DEK using old KEK
    const oldKekIv = Buffer.from(envelope.kekIv, 'hex');
    const oldKekTag = Buffer.from(envelope.kekTag, 'hex');
    const kekDecipher = crypto.createDecipheriv('aes-256-gcm', normOldKek, oldKekIv);
    kekDecipher.setAuthTag(oldKekTag);

    let dekHex = kekDecipher.update(envelope.wrappedDek, 'hex', 'utf8');
    dekHex += kekDecipher.final('utf8');
    const dek = Buffer.from(dekHex, 'hex');

    // 2. Re-wrap DEK with new KEK
    const newKekIv = crypto.randomBytes(12);
    const kekCipher = crypto.createCipheriv('aes-256-gcm', normNewNewKek(newKek), newKekIv);
    let newWrappedDek = kekCipher.update(dek.toString('hex'), 'utf8', 'hex');
    newWrappedDek += kekCipher.final('hex');
    const newKekTag = kekCipher.getAuthTag().toString('hex');

    // 3. Return updated envelope preserving the original ciphertext, iv, and authTag
    return {
      ...envelope,
      version: (envelope.version || 1) + 1,
      wrappedDek: newWrappedDek,
      kekIv: newKekIv.toString('hex'),
      kekTag: newKekTag,
      lastRotatedAt: new Date().toISOString()
    };
  }

  /**
   * Rotates all envelope-encrypted fields in a database snapshot or records array
   */
  rotateDatabaseKeys(dbState, oldKek, newKek) {
    const startTime = Date.now();
    const oldFp = this.getFingerprint(oldKek);
    const newFp = this.getFingerprint(newKek);
    let envelopesRotated = 0;

    const normNewKek = this.normalizeKek(newKek);
    const normOldKek = this.normalizeKek(oldKek);

    // Recursive helper to traverse state and re-wrap any envelope objects
    const traverseAndRewrap = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;

      if (obj.wrappedDek && obj.ciphertext && obj.kekIv && obj.kekTag) {
        envelopesRotated++;
        // Unwrap DEK with old KEK
        const oldKekIv = Buffer.from(obj.kekIv, 'hex');
        const oldKekTag = Buffer.from(obj.kekTag, 'hex');
        const kekDecipher = crypto.createDecipheriv('aes-256-gcm', normOldKek, oldKekIv);
        kekDecipher.setAuthTag(oldKekTag);
        let dekHex = kekDecipher.update(obj.wrappedDek, 'hex', 'utf8');
        dekHex += kekDecipher.final('utf8');
        const dek = Buffer.from(dekHex, 'hex');

        // Re-wrap with new KEK
        const newKekIv = crypto.randomBytes(12);
        const kekCipher = crypto.createCipheriv('aes-256-gcm', normNewKek, newKekIv);
        let newWrappedDek = kekCipher.update(dek.toString('hex'), 'utf8', 'hex');
        newWrappedDek += kekCipher.final('hex');
        const newKekTag = kekCipher.getAuthTag().toString('hex');

        return {
          ...obj,
          version: (obj.version || 1) + 1,
          wrappedDek: newWrappedDek,
          kekIv: newKekIv.toString('hex'),
          kekTag: newKekTag,
          lastRotatedAt: new Date().toISOString()
        };
      }

      if (Array.isArray(obj)) {
        return obj.map(item => traverseAndRewrap(item));
      }

      const res = {};
      for (const [key, val] of Object.entries(obj)) {
        res[key] = traverseAndRewrap(val);
      }
      return res;
    };

    const rotatedDbState = traverseAndRewrap(dbState);
    const durationMs = Date.now() - startTime;

    const auditLog = {
      action: "ENVELOPE_KEY_ROTATION",
      timestamp: new Date().toISOString(),
      previousKekFingerprint: oldFp,
      newKekFingerprint: newFp,
      envelopesRotated,
      durationMs,
      status: "SUCCESS"
    };

    return {
      success: true,
      rotatedDbState,
      auditLog
    };
  }
}

function normNewNewKek(newKek) {
  if (Buffer.isBuffer(newKek) && newKek.length === 32) return newKek;
  return crypto.createHash('sha256').update(String(newKek)).digest();
}

const defaultKeyRotationService = new KeyRotationService();
defaultKeyRotationService.KeyRotationService = KeyRotationService;

module.exports = defaultKeyRotationService;
