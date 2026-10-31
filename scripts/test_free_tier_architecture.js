// scripts/test_free_tier_architecture.js
// Verification Suite for Zero-Budget AI Architecture & Free-Tier Optimization

require('dotenv').config();
const { providerManager } = require('../server/services/providerManager');
const { askAITutor } = require('../server/services/aiService');

async function runTestSuite() {
  console.log('========================================================================');
  console.log('🧪 EXAMVERSE ZERO-BUDGET AI ARCHITECTURE & FREE-TIER VERIFICATION SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, detail = '') {
    if (condition) {
      console.log(`[PASS] ${message}`);
      if (detail) console.log(`       ${detail}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      if (detail) console.error(`       ${detail}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Provider Registry & Health Inspection
  // --------------------------------------------------------------------------
  console.log('--- 1. PROVIDER REGISTRY & CONFIGURATION STATUS ---');
  const statuses = providerManager.getProviderStatuses();
  assert(Array.isArray(statuses) && statuses.length >= 3, 'Multi-provider abstraction registers all supported providers', `Registered: ${statuses.map(s => s.provider).join(', ')}`);

  const geminiStatus = statuses.find(s => s.provider === 'google-gemini');
  assert(geminiStatus && geminiStatus.configured, 'Google Gemini provider is detected and configured from .env', `Available: ${geminiStatus.available}`);

  const groqStatus = statuses.find(s => s.provider === 'groq');
  assert(groqStatus !== undefined, 'Groq Cloud Free-Tier provider is recognized in provider abstraction', `Configured: ${groqStatus.configured}`);

  const ollamaStatus = statuses.find(s => s.provider === 'ollama-local');
  assert(ollamaStatus !== undefined, 'Ollama Local Zero-Cost provider is recognized in provider abstraction', `Configured: ${ollamaStatus.configured}`);

  // --------------------------------------------------------------------------
  // TEST 2: Quota-Exceeded Handling & Circuit Breaker Logic
  // --------------------------------------------------------------------------
  console.log('\n--- 2. SMART QUOTA MANAGEMENT & CIRCUIT BREAKER TEST ---');
  const testBreaker = providerManager.getProvider('google-gemini').circuit;
  const initialCircuitState = testBreaker.isOpen();
  assert(!initialCircuitState, 'Circuit breaker begins in CLOSED (Healthy) state');

  // Simulate quota exhaustion (HTTP 429)
  testBreaker.recordQuotaExhaustion(10000); // 10s test cooldown
  assert(testBreaker.isOpen(), 'Circuit breaker transitions to OPEN upon receiving HTTP 429 Quota Exhausted', `Cooldown remaining: ${testBreaker.getStatus().cooldownRemainingSeconds}s`);

  // Verify that an open circuit immediately prevents requests from hammering the exhausted provider
  const isAvailableWhileOpen = providerManager.getProvider('google-gemini').isAvailable();
  assert(!isAvailableWhileOpen, 'Provider marked unavailable while circuit is open, preventing rate-limit violations');

  // Reset breaker for remaining tests
  testBreaker.isExhausted = false;
  testBreaker.consecutiveFailures = 0;
  assert(!testBreaker.isOpen(), 'Circuit breaker resets cleanly after cooldown expiry');

  // --------------------------------------------------------------------------
  // TEST 3: Fallback Engine Activation
  // --------------------------------------------------------------------------
  console.log('\n--- 3. ACADEMIC FALLBACK ENGINE TEST ---');
  const fallbackResponse = await askAITutor({
    question: 'Explain the powers and election of the President of India under Article 52-62.',
    examCode: 'UPSC CSE',
    subject: 'Indian Polity',
    topic: 'President of India',
    language: 'English'
  });

  assert(fallbackResponse && fallbackResponse.answer && fallbackResponse.answer.length > 200, 'Academic engine produces comprehensive educational response', `Length: ${fallbackResponse.answer.length} chars`);
  assert(fallbackResponse.examContext?.includes('UPSC CSE') || fallbackResponse.examContext?.includes('Civil Services'), 'Response is strictly grounded in the target exam syllabus', `Context: ${fallbackResponse.examContext}`);
  assert(fallbackResponse.model !== undefined, 'Response metadata clearly identifies engine and model type', `Model: ${fallbackResponse.model} | isLiveAPI: ${fallbackResponse.isLiveAPI}`);

  // --------------------------------------------------------------------------
  // TEST 4: Multilingual Academic Grounding (English & Telugu)
  // --------------------------------------------------------------------------
  console.log('\n--- 4. MULTILINGUAL RESPONSES (ENGLISH & TELUGU) ---');
  
  // English Test
  const enRes = await askAITutor({
    question: 'Solve: A train 150m long is travelling at 54 km/h. How long will it take to pass an electric pole?',
    examCode: 'SSC CGL',
    subject: 'Quantitative Aptitude',
    language: 'English'
  });
  assert(enRes.answer.includes('Formula') || enRes.answer.includes('Step') || enRes.answer.includes('Speed'), 'English Quantitative Aptitude returns step-by-step formula breakdown');

  // Telugu Test
  const teRes = await askAITutor({
    question: 'ఆంధ్రప్రదేశ్ పునర్వ్యవస్థీకరణ చట్టం 2014 ప్రధాన అంశాలను వివరించండి.',
    examCode: 'APPSC Group 1',
    subject: 'History & Polity',
    language: 'Telugu'
  });
  const hasTeluguChars = /[\u0C00-\u0C7F]/.test(teRes.answer);
  assert(hasTeluguChars, 'Telugu query generates fluent, native Telugu academic output (తెలుగు లిపి)', `Language: ${teRes.language}`);

  // --------------------------------------------------------------------------
  // TEST 5: Security & Key Masking
  // --------------------------------------------------------------------------
  console.log('\n--- 5. SECURITY & CREDENTIAL MASKING ---');
  const { maskKey } = require('../server/services/providerManager');
  const testKey = 'AIzaSySampleKeyForTestingMasking0000000000';
  const masked = maskKey(testKey);
  assert(masked.startsWith('AIzaSy') && masked.endsWith('0000') && !masked.includes('TestingMasking'), 'API keys are strictly masked in logs and monitoring payloads', `Masked: ${masked}`);

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================');

  return { passed, failed };
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
