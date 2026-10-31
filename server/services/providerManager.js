// server/services/providerManager.js
// Multi-Provider Free-Tier AI Architecture & Smart Quota Manager for EXAMVERSE
// Designed for Zero-Budget Academic Assistance with Strict Provider Abstraction,
// Circuit Breaking, Exponential Backoff, and Syllabus-Grounded Fallback.

const https = require('https');
const http = require('http');

// Mask sensitive credentials in logs (e.g., AQ.Ab8...w9ynQ)
function maskKey(key) {
  if (!key || typeof key !== 'string') return '[NONE]';
  if (key.length <= 8) return '****';
  return key.slice(0, 6) + '...' + key.slice(-4);
}

// ============================================================================
// 1. SMART QUOTA & CIRCUIT BREAKER TRACKER
// ============================================================================
class ProviderCircuitBreaker {
  constructor(name) {
    this.name = name;
    this.isExhausted = false;
    this.exhaustedUntil = 0;
    this.consecutiveFailures = 0;
    this.totalRequests = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.lastError = null;
    this.lastSuccessTimestamp = null;
  }

  isOpen() {
    if (this.isExhausted) {
      if (Date.now() > this.exhaustedUntil) {
        // Cooldown period expired, allow a canary test
        this.isExhausted = false;
        this.consecutiveFailures = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess() {
    this.totalRequests++;
    this.successCount++;
    this.consecutiveFailures = 0;
    this.isExhausted = false;
    this.lastSuccessTimestamp = Date.now();
  }

  recordQuotaExhaustion(cooldownMs = 3600000) { // Default 1 hour cooldown for 429
    this.totalRequests++;
    this.failureCount++;
    this.isExhausted = true;
    this.exhaustedUntil = Date.now() + cooldownMs;
    this.lastError = 'DAILY_QUOTA_EXHAUSTED (HTTP 429)';
    console.warn(`[QuotaManager] Provider '${this.name}' daily quota exhausted. Circuit open for ${Math.round(cooldownMs / 60000)}m.`);
  }

  recordTemporaryError(err) {
    this.totalRequests++;
    this.failureCount++;
    this.consecutiveFailures++;
    this.lastError = err.message || 'TEMPORARY_ERROR';
    // If 3 consecutive network/503 errors occur, pause provider for 60 seconds
    if (this.consecutiveFailures >= 3) {
      this.isExhausted = true;
      this.exhaustedUntil = Date.now() + 60000;
      console.warn(`[QuotaManager] Provider '${this.name}' experienced ${this.consecutiveFailures} consecutive errors. Cooling down for 60s.`);
    }
  }

  getStatus() {
    return {
      provider: this.name,
      circuitOpen: this.isOpen(),
      exhausted: this.isExhausted,
      cooldownRemainingSeconds: Math.max(0, Math.round((this.exhaustedUntil - Date.now()) / 1000)),
      totalRequests: this.totalRequests,
      successCount: this.successCount,
      failureCount: this.failureCount,
      lastError: this.lastError
    };
  }
}

// ============================================================================
// 2. GOOGLE GEMINI PROVIDER (Primary Official Free-Tier Provider)
// ============================================================================
class GeminiProvider {
  constructor() {
    this.name = 'google-gemini';
    this.circuit = new ProviderCircuitBreaker(this.name);
    this.genAIClient = null;
    this.lastRequestTimestamp = 0;
    this.minIntervalMs = 2000; // Throttle to stay safely within Free-Tier 15 RPM
  }

  getClient() {
    if (!this.genAIClient) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (apiKey) {
        try {
          const { GoogleGenAI } = require('@google/genai');
          this.genAIClient = new GoogleGenAI({ apiKey });
        } catch (err) {
          console.warn("[GeminiProvider] Initialization error:", err.message);
        }
      }
    }
    return this.genAIClient;
  }

  isConfigured() {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
    return !!key && key.trim().length > 0;
  }

  isAvailable() {
    return this.isConfigured() && !this.circuit.isOpen();
  }

  async generate(prompt, options = {}) {
    if (!this.isAvailable()) {
      throw new Error(`Gemini Provider currently unavailable (Circuit open: ${this.circuit.isOpen()})`);
    }

    const client = this.getClient();
    if (!client) {
      throw new Error("Gemini client not initialized");
    }

    // Rate-limit smoothing (Free-tier RPM protection)
    const now = Date.now();
    const waitTime = Math.max(0, this.minIntervalMs - (now - this.lastRequestTimestamp));
    if (waitTime > 0) {
      await new Promise(r => setTimeout(r, waitTime));
    }
    this.lastRequestTimestamp = Date.now();

    const targetModel = options.model || 'gemini-3.8-flash';
    const timeoutMs = options.timeoutMs || 25000;

    // Execute with exponential backoff for temporary spikes (503)
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const apiPromise = client.models.generateContent({
          model: targetModel,
          contents: prompt
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), timeoutMs)
        );

        const response = await Promise.race([apiPromise, timeoutPromise]);
        if (response && response.text) {
          this.circuit.recordSuccess();
          return {
            text: response.text,
            model: targetModel,
            provider: this.name,
            isLiveAPI: true
          };
        }
        throw new Error('Empty response from Gemini API');
      } catch (err) {
        const isQuota = err.status === 429 || err.message?.includes('429') || err.message?.includes('quota');
        const is503 = err.status === 503 || err.message?.includes('503') || err.message?.includes('high demand');

        if (isQuota) {
          // Strict Rule: Never retry daily exhausted quotas
          this.circuit.recordQuotaExhaustion(3600000); // 1 hour cooldown
          throw new Error(`Gemini Free Tier Quota Exhausted (429): ${err.message}`);
        }

        if (is503 && attempts < maxAttempts) {
          // Exponential backoff for temporary server spike
          const backoff = attempts * 1500;
          console.warn(`[GeminiProvider] Temporary 503 spike, retrying in ${backoff}ms (attempt ${attempts}/${maxAttempts})...`);
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }

        this.circuit.recordTemporaryError(err);
        throw err;
      }
    }
  }
}

// ============================================================================
// 3. GROQ FREE-TIER PROVIDER (Alternative Free Tier: Llama 3.3 70B / 3.1 8B)
// ============================================================================
class GroqProvider {
  constructor() {
    this.name = 'groq';
    this.circuit = new ProviderCircuitBreaker(this.name);
  }

  isConfigured() {
    return !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0;
  }

  isAvailable() {
    return this.isConfigured() && !this.circuit.isOpen();
  }

  async generate(prompt, options = {}) {
    if (!this.isAvailable()) {
      throw new Error(`Groq Provider unavailable (Circuit open: ${this.circuit.isOpen()})`);
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = options.model || 'llama-3.3-70b-versatile';

    const payload = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are the EXAMVERSE AI Academic Tutor. Provide authoritative, step-by-step educational responses formatted in clean markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    return new Promise((resolve, reject) => {
      const req = https.request('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 20000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(body);
              const text = data.choices?.[0]?.message?.content;
              if (text) {
                this.circuit.recordSuccess();
                return resolve({
                  text: text,
                  model: model,
                  provider: this.name,
                  isLiveAPI: true
                });
              }
              reject(new Error('Malformed response from Groq'));
            } catch (pErr) {
              reject(pErr);
            }
          } else if (res.statusCode === 429) {
            this.circuit.recordQuotaExhaustion(1800000); // 30m cooldown
            reject(new Error(`Groq Rate Limit Exceeded (429): ${body}`));
          } else {
            this.circuit.recordTemporaryError(new Error(`Groq HTTP ${res.statusCode}: ${body}`));
            reject(new Error(`Groq HTTP ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        this.circuit.recordTemporaryError(new Error('Groq request timeout'));
        reject(new Error('Groq request timeout'));
      });

      req.on('error', (err) => {
        this.circuit.recordTemporaryError(err);
        reject(err);
      });

      req.write(payload);
      req.end();
    });
  }
}

// ============================================================================
// 4. OLLAMA LOCAL OPEN-SOURCE PROVIDER (Zero External Cost, Runs on Machine)
// ============================================================================
class OllamaProvider {
  constructor() {
    this.name = 'ollama-local';
    this.circuit = new ProviderCircuitBreaker(this.name);
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
  }

  isConfigured() {
    return process.env.ENABLE_OLLAMA === 'true' || process.env.OLLAMA_BASE_URL !== undefined;
  }

  isAvailable() {
    return this.isConfigured() && !this.circuit.isOpen();
  }

  async checkHealth() {
    return new Promise((resolve) => {
      try {
        const u = new URL(this.baseUrl);
        const req = http.request({
          hostname: u.hostname,
          port: u.port || 11434,
          path: '/api/tags',
          method: 'GET',
          timeout: 2000
        }, (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => { req.destroy(); resolve(false); });
        req.end();
      } catch (e) {
        resolve(false);
      }
    });
  }

  async generate(prompt, options = {}) {
    const isUp = await this.checkHealth();
    if (!isUp) {
      this.circuit.recordTemporaryError(new Error('Ollama local daemon not reachable on ' + this.baseUrl));
      throw new Error(`Ollama local daemon is not running on ${this.baseUrl}`);
    }

    const payload = JSON.stringify({
      model: options.model || this.model,
      prompt: prompt,
      stream: false
    });

    return new Promise((resolve, reject) => {
      const u = new URL(this.baseUrl);
      const req = http.request({
        hostname: u.hostname,
        port: u.port || 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 45000 // Local CPU inference allowance
      }, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(body);
              if (data.response) {
                this.circuit.recordSuccess();
                return resolve({
                  text: data.response,
                  model: options.model || this.model,
                  provider: this.name,
                  isLiveAPI: true
                });
              }
            } catch (e) {
              return reject(e);
            }
          }
          reject(new Error(`Ollama error HTTP ${res.statusCode}: ${body}`));
        });
      });

      req.on('error', (err) => {
        this.circuit.recordTemporaryError(err);
        reject(err);
      });
      req.on('timeout', () => {
        req.destroy();
        this.circuit.recordTemporaryError(new Error('Ollama inference timeout'));
        reject(new Error('Ollama inference timeout'));
      });

      req.write(payload);
      req.end();
    });
  }
}

// ============================================================================
// 5. UNIFIED MULTI-PROVIDER ORCHESTRATOR
// ============================================================================
class AIProviderManager {
  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      groq: new GroqProvider(),
      ollama: new OllamaProvider()
    };
    this.primaryProviderName = 'gemini';
  }

  getProvider(name) {
    if (this.providers[name]) return this.providers[name];
    const normalized = name?.replace('google-', '')?.replace('-local', '');
    return this.providers[normalized] || null;
  }

  // Returns list of providers and their live health status
  getProviderStatuses() {
    return Object.values(this.providers).map(p => ({
      provider: p.name,
      configured: p.isConfigured(),
      available: p.isAvailable(),
      stats: p.circuit.getStatus()
    }));
  }

  // Fallback-resilient generation chain: Gemini -> Groq -> Ollama -> Null (triggers Academic Engine)
  async generateWithFailover(prompt, options = {}) {
    const providerPriority = ['gemini', 'groq', 'ollama'];
    const attemptsLog = [];

    for (const providerKey of providerPriority) {
      const provider = this.providers[providerKey];
      if (!provider || !provider.isConfigured()) {
        continue;
      }

      if (!provider.isAvailable()) {
        attemptsLog.push({ provider: provider.name, skipped: true, reason: 'Circuit Open / Cooldown' });
        continue;
      }

      try {
        console.log(`[ProviderManager] Attempting generation via provider: ${provider.name}...`);
        const result = await provider.generate(prompt, options);
        if (result && result.text) {
          return {
            ...result,
            attemptsLog
          };
        }
      } catch (err) {
        console.warn(`[ProviderManager] Provider '${provider.name}' failed: ${err.message}. Trying next provider...`);
        attemptsLog.push({ provider: provider.name, error: err.message });
      }
    }

    // All live cloud/local providers exhausted or unconfigured -> signals caller to activate Academic Fallback Engine
    return null;
  }
}

const providerManager = new AIProviderManager();

module.exports = {
  providerManager,
  maskKey
};
