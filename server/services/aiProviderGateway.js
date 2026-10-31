// server/services/aiProviderGateway.js
// Unified AI Provider Gateway for EXAMVERSE
// Tier 1: Primary Gemini 3.8 Flash (Official Google GenAI SDK)
// Tier 2: Groq Cloud Free-Tier (Llama 3.3 70B / 3.1 8B)
// Tier 3: Local In-Memory / Redis LRU Response Cache
// Tier 4: Guaranteed Offline Syllabus-Grounded Deterministic Academic Engine

const { providerManager } = require('./providerManager');
const { generateFallbackTutorResponse } = require('./aiService');

// In-Memory LRU Response Cache
class LRUCache {
  constructor(maxSize = 200, ttlMs = 1000 * 60 * 60 * 12) { // 12 hours TTL
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }

  _getKey(query, examCode, subject, language) {
    return `${(examCode || 'ALL').toUpperCase()}:${(language || 'en').toLowerCase()}:${query.trim().toLowerCase()}`;
  }

  get(query, examCode, subject, language) {
    const key = this._getKey(query, examCode, subject, language);
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Refresh LRU order
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.data;
  }

  set(query, examCode, subject, language, data) {
    const key = this._getKey(query, examCode, subject, language);
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  size() {
    return this.cache.size;
  }
}

const responseCache = new LRUCache();

class AIProviderGateway {
  constructor() {
    this.gatewayVersion = '2.0.0';
    this.cache = responseCache;
  }

  /**
   * Health Telemetry for /api/ai/health
   */
  getHealthTelemetry() {
    const statuses = providerManager ? providerManager.getProviderStatuses() : [];
    const activeCount = statuses.filter(p => p.configured && p.available).length;
    return {
      status: 'HEALTHY',
      gatewayVersion: this.gatewayVersion,
      cachedQueriesCount: this.cache.size(),
      activeProviderCount: activeCount,
      primaryProvider: 'google-gemini-3.8-flash',
      providers: statuses,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute Generation with Multi-Tier Fallback Gateway
   */
  async generateAcademicResponse({ question, examObj, examCode, subject, topic, language = 'English' }) {
    // 1. Check LRU Cache
    const cached = this.cache.get(question, examCode, subject, language);
    if (cached) {
      return {
        ...cached,
        isFromCache: true,
        cachedAt: cached.timestamp
      };
    }

    // 2. Build Structured Pedagogical Prompt
    const prompt = `
You are the EXAMVERSE AI Academic Study Tutor, India's leading competitive exam guidance AI.
Target Examination: ${examObj ? `${examObj.title} (${examObj.code})` : examCode || 'All-India Competitive Exam'}
Subject: ${subject || 'General'}
Topic: ${topic || 'Core Concept'}
Response Language: ${language}

Question: "${question}"

Provide a pedagogical, step-by-step academic response in ${language}. Include:
1. Core Conceptual Principle
2. Step-by-Step Breakdown / Mathematical Derivation
3. Exam Relevance & Negative Marking Tip
4. Key Formula or Memory Trick Box
`;

    // 3. Attempt Live Cloud Providers (Gemini -> Groq -> Ollama)
    try {
      const response = await providerManager.generateWithFailover(prompt, {
        model: 'gemini-3.8-flash',
        timeoutMs: 25000
      });

      if (response && response.text) {
        const result = {
          answer: response.text,
          model: response.model,
          provider: response.provider,
          isLiveAPI: true,
          apiKeyConfigured: true,
          language,
          examContext: examObj ? `${examObj.title} (${examObj.code})` : examCode,
          timestamp: new Date().toISOString()
        };
        // Store in cache
        this.cache.set(question, examCode, subject, language, result);
        return result;
      }
    } catch (err) {
      console.warn(`[AIProviderGateway] Live providers exhausted (${err.message}), engaging guaranteed academic fallback engine.`);
    }

    // 4. Guaranteed Offline Fallback Engine
    const fallback = generateFallbackTutorResponse(question, examObj, examCode, subject, topic, language);
    const fallbackResult = {
      ...fallback,
      provider: 'academic-fallback',
      apiKeyConfigured: true,
      isLiveAPI: false,
      examContext: examObj ? `${examObj.title} (${examObj.code})` : examCode,
      timestamp: new Date().toISOString()
    };
    return fallbackResult;
  }

  /**
   * Direct prompt execution for academic companion with automatic failover
   */
  async executeAI({ prompt, systemInstruction, timeoutMs = 25000 }) {
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
    try {
      const response = await providerManager.generateWithFailover(fullPrompt, {
        model: 'gemini-3.8-flash',
        timeoutMs
      });
      if (response && response.text) {
        return {
          text: response.text,
          model: response.model,
          provider: response.provider,
          isLiveAPI: true
        };
      }
    } catch (err) {
      console.warn(`[AIProviderGateway] executeAI failover exhausted: ${err.message}`);
    }
    return null;
  }

  /**
   * Universal completion method for Document Intelligence & AI Assistants
   */
  async generateCompletion({ systemPrompt, prompt, temperature = 0.2, maxOutputTokens = 1000, timeoutMs = 25000 }) {
    return this.executeAI({ prompt, systemInstruction: systemPrompt, timeoutMs });
  }
}

const gateway = new AIProviderGateway();
module.exports = gateway;
