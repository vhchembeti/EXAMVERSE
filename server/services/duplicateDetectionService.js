// server/services/duplicateDetectionService.js
// Enterprise MinHash 5-gram token shingling, Jaccard similarity, Levenshtein edit distance,
// and statutory tuple (authority, advt_number, exam_cycle) duplicate suppression engine.

const crypto = require('crypto');

class DuplicateDetectionService {
  constructor() {
    this.numHashes = 64;
    // Generate deterministic hash seeds for MinHash permutations
    this.hashSeeds = [];
    const prime = 2147483647; // 2^31 - 1 (Mersenne prime)
    for (let i = 0; i < this.numHashes; i++) {
      const a = (i * 10007 + 3821) % (prime - 1) + 1;
      const b = (i * 49157 + 769) % prime;
      this.hashSeeds.push({ a, b, prime });
    }
  }

  /**
   * Tokenize and normalize text into clean tokens
   */
  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  /**
   * Generate token n-grams (shingles). Defaults to 5-grams; falls back to 2-3 grams if text is short.
   */
  generateShingles(text, n = 5) {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) return new Set();

    // Adaptive n if text has fewer tokens
    const actualN = tokens.length < n ? Math.max(1, Math.min(tokens.length, 2)) : n;
    const shingles = new Set();

    for (let i = 0; i <= tokens.length - actualN; i++) {
      const shingle = tokens.slice(i, i + actualN).join(' ');
      shingles.add(shingle);
    }

    return shingles;
  }

  /**
   * Fast integer hash for string shingle
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  /**
   * Compute MinHash signature of length numHashes (64)
   */
  computeMinHashSignature(text) {
    const shingles = this.generateShingles(text, 5);
    if (shingles.size === 0) {
      return new Array(this.numHashes).fill(0);
    }

    const signature = new Array(this.numHashes).fill(Infinity);
    const shingleHashes = Array.from(shingles).map(s => this.hashString(s));

    for (let h = 0; h < this.numHashes; h++) {
      const { a, b, prime } = this.hashSeeds[h];
      for (const sh of shingleHashes) {
        const val = (a * sh + b) % prime;
        if (val < signature[h]) {
          signature[h] = val;
        }
      }
    }

    return signature;
  }

  /**
   * Estimate Jaccard similarity from MinHash signatures
   */
  estimateJaccardSimilarity(sigA, sigB) {
    if (!sigA || !sigB || sigA.length !== sigB.length) return 0;
    let matchCount = 0;
    for (let i = 0; i < sigA.length; i++) {
      if (sigA[i] === sigB[i]) {
        matchCount++;
      }
    }
    return matchCount / sigA.length;
  }

  /**
   * Calculate exact Jaccard similarity between two Sets
   */
  exactJaccardSimilarity(setA, setB) {
    if (!setA || !setB || setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Compute classic Levenshtein edit distance
   */
  levenshteinDistance(str1, str2) {
    const s1 = (str1 || '').trim().toLowerCase();
    const s2 = (str2 || '').trim().toLowerCase();
    if (s1 === s2) return 0;
    if (s1.length === 0) return s2.length;
    if (s2.length === 0) return s1.length;

    const row = [];
    for (let j = 0; j <= s2.length; j++) {
      row[j] = j;
    }

    for (let i = 1; i <= s1.length; i++) {
      let prev = i;
      for (let j = 1; j <= s2.length; j++) {
        let val;
        if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
          val = row[j - 1];
        } else {
          val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
        }
        row[j - 1] = prev;
        prev = val;
      }
      row[s2.length] = prev;
    }

    return row[s2.length];
  }

  /**
   * Normalized Levenshtein similarity [0.0 - 1.0]
   */
  levenshteinSimilarity(str1, str2) {
    const s1 = (str1 || '').trim().toLowerCase();
    const s2 = (str2 || '').trim().toLowerCase();
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1.0;
    const dist = this.levenshteinDistance(s1, s2);
    return Math.max(0, 1 - dist / maxLen);
  }

  /**
   * Extract and normalize statutory tuple key: (authority_id, advt_number, exam_cycle)
   */
  extractStatutoryKey(notice) {
    const authority = (notice.authorityId || notice.authority || '').trim().toUpperCase();
    
    // Normalize advertisement number: strip spaces, normalize slashes and hyphens
    let advt = (notice.advtNumber || notice.advertisementNumber || notice.noticeNumber || '').trim().toUpperCase();
    advt = advt.replace(/[\s\t\r\n]+/g, '').replace(/[-_–—]/g, '-');

    // Extract year/cycle
    let cycle = (notice.examCycle || notice.cycle || notice.year || '').toString().trim();
    if (!cycle && notice.title) {
      const yearMatch = notice.title.match(/\b(202[0-9])\b/);
      if (yearMatch) cycle = yearMatch[1];
    }

    if (authority && advt && advt !== 'N/A' && advt !== 'UNKNOWN') {
      return `${authority}::${advt}::${cycle || 'ALL'}`;
    }

    return null;
  }

  /**
   * Detect duplicates against an existing array of notices.
   * Returns evaluation with match type, scores, and whether it represents an update/corrigendum.
   */
  evaluateDuplicate(incoming, existingNotices = []) {
    if (!incoming || !existingNotices || existingNotices.length === 0) {
      return { isDuplicate: false, confidence: 0, reason: "No existing notices to compare against." };
    }

    const incomingKey = this.extractStatutoryKey(incoming);
    const incomingText = `${incoming.title || ''} ${incoming.rawText || incoming.summary || incoming.description || ''}`;
    const incomingSig = this.computeMinHashSignature(incomingText);
    const incomingTitle = incoming.title || '';

    // Check if incoming is explicitly flagged as a corrigendum/extension
    const isCorrigendumTitle = /\b(corrigendum|addendum|amendment|cancellation|extension|reschedule|revised|errata)\b/i.test(incomingTitle);

    for (const existing of existingNotices) {
      if (existing.id === incoming.id) continue;

      // 1. Exact Statutory Key Match
      const existingKey = this.extractStatutoryKey(existing);
      if (incomingKey && existingKey && incomingKey === existingKey) {
        if (isCorrigendumTitle) {
          return {
            isDuplicate: false,
            isCorrigendum: true,
            targetNoticeId: existing.id,
            matchType: 'STATUTORY_CORRIGENDUM_MATCH',
            statutoryKey: incomingKey,
            confidence: 0.98,
            reason: `Matches advertisement number '${incomingKey}', but is a published Corrigendum/Revision.`
          };
        }

        return {
          isDuplicate: true,
          duplicateOf: existing.id,
          matchType: 'EXACT_STATUTORY_TUPLE',
          statutoryKey: incomingKey,
          confidence: 1.0,
          reason: `Exact statutory tuple match on authority, advt number, and cycle (${incomingKey}).`
        };
      }

      // 2. High Title Similarity Check
      const titleSim = this.levenshteinSimilarity(incomingTitle, existing.title || '');
      
      // 3. MinHash Shingle Content Jaccard Estimation
      const existingText = `${existing.title || ''} ${existing.rawText || existing.summary || existing.description || ''}`;
      const existingSig = this.computeMinHashSignature(existingText);
      const jaccardSim = this.estimateJaccardSimilarity(incomingSig, existingSig);

      // Evaluate fuzzy duplicate conditions:
      // Condition A: Nearly identical title (>= 0.92) and moderate content overlap (>= 0.65)
      // Condition B: High content overlap (>= 0.82) and reasonable title similarity (>= 0.70)
      if ((titleSim >= 0.92 && jaccardSim >= 0.65) || (jaccardSim >= 0.82 && titleSim >= 0.70)) {
        if (isCorrigendumTitle) {
          return {
            isDuplicate: false,
            isCorrigendum: true,
            targetNoticeId: existing.id,
            matchType: 'FUZZY_CORRIGENDUM_LINK',
            titleSimilarity: Number(titleSim.toFixed(3)),
            jaccardSimilarity: Number(jaccardSim.toFixed(3)),
            confidence: 0.92,
            reason: `High lexical overlap with notice '${existing.id}', classified as a Corrigendum/Update.`
          };
        }

        return {
          isDuplicate: true,
          duplicateOf: existing.id,
          matchType: 'FUZZY_MINHASH_SHINGLE',
          titleSimilarity: Number(titleSim.toFixed(3)),
          jaccardSimilarity: Number(jaccardSim.toFixed(3)),
          confidence: Number(Math.max(titleSim, jaccardSim).toFixed(3)),
          reason: `High MinHash shingle Jaccard overlap (${(jaccardSim * 100).toFixed(1)}%) and title similarity (${(titleSim * 100).toFixed(1)}%).`
        };
      }
    }

    return {
      isDuplicate: false,
      confidence: 0.95,
      reason: "No duplicate statutory key or MinHash shingle threshold exceeded."
    };
  }
}

module.exports = new DuplicateDetectionService();
