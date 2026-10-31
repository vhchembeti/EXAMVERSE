#!/usr/bin/env node
// scripts/smoke-test.js
// Post-Deployment Automated Smoke Test Suite for Live Production Environments
// Verifies live endpoints: health, readiness, SPA delivery, GATE 2027 papers, search, admin guard, and security headers.

const http = require('http');
const https = require('https');
const { URL } = require('url');

const targetUrl = process.argv[2] || process.env.LIVE_APP_URL || process.env.APP_URL || 'http://localhost:5000';
console.log('==================================================================');
console.log('🚀 EXAMVERSE POST-DEPLOYMENT LIVE SMOKE TEST');
console.log(`Target URL: ${targetUrl}`);
console.log('==================================================================\n');

function makeRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(endpoint, targetUrl);
    const client = fullUrl.protocol === 'https:' ? https : http;

    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'EXAMVERSE-SmokeTest/2.0',
        ...(options.headers || {})
      },
      timeout: options.timeout || 15000
    };

    const req = client.request(fullUrl, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout after ${options.timeout || 15000}ms connecting to ${fullUrl.href}`));
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runSmokeTests() {
  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Reason: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check (Liveness)
  await check('1. Health Check (GET /api/health)', async () => {
    const res = await makeRequest('/api/health');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.json || res.json.status !== 'HEALTHY') throw new Error(`Expected status 'HEALTHY', got ${JSON.stringify(res.json)}`);
  });

  // 2. Readiness check (Readiness Probe)
  await check('2. Readiness Check (GET /api/ready)', async () => {
    const res = await makeRequest('/api/ready');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.json || !res.json.ready) throw new Error(`Expected ready: true, got ${JSON.stringify(res.json)}`);
  });

  // 3. Home HTML SPA Shell
  await check('3. Frontend SPA Root (GET /)', async () => {
    const res = await makeRequest('/');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.body.includes('<html') || !res.body.includes('root')) throw new Error('Root HTML does not contain SPA shell');
  });

  // 4. GATE 2027 Papers Registry
  await check('4. GATE 2027 Registry (GET /api/gate/papers)', async () => {
    const res = await makeRequest('/api/gate/papers');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const papers = res.json?.papers || res.json;
    if (!Array.isArray(papers) || papers.length !== 30) throw new Error(`Expected 30 papers, got ${papers ? papers.length : 'none'}`);
    const hasRA = papers.some(p => p.code === 'RA');
    if (!hasRA) throw new Error('Paper RA (Robotics and Automation) missing from 2027 papers list');
  });

  // 5. Universal Search Directory
  await check('5. Universal Search Directory (GET /api/exams/directory?search=civil)', async () => {
    const res = await makeRequest('/api/exams/directory?search=civil');
    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    const results = res.json?.results || res.json?.exams || res.json?.data;
    if (!results || !Array.isArray(results)) throw new Error('Search endpoint must return results payload');
  });

  // 6. Admin Route Protection (Anti-IDOR / Anti-BOLA)
  await check('6. Admin Route Guard (GET /api/admin/overview without credentials)', async () => {
    const res = await makeRequest('/api/admin/overview');
    if (res.statusCode !== 401 && res.statusCode !== 403) {
      throw new Error(`Expected 401 or 403 Forbidden for anonymous user, got ${res.statusCode}`);
    }
  });

  // 7. OWASP ASVS Level 2 Security Headers Audit
  await check('7. HTTP Security Headers Audit', async () => {
    const res = await makeRequest('/api/health');
    const headers = res.headers;

    const requiredHeaders = [
      { name: 'content-security-policy', desc: 'Content-Security-Policy' },
      { name: 'strict-transport-security', desc: 'Strict-Transport-Security' },
      { name: 'x-content-type-options', desc: 'X-Content-Type-Options: nosniff' },
      { name: 'x-frame-options', desc: 'X-Frame-Options: DENY' },
      { name: 'referrer-policy', desc: 'Referrer-Policy' },
      { name: 'cross-origin-opener-policy', desc: 'Cross-Origin-Opener-Policy: same-origin' }
    ];

    for (const h of requiredHeaders) {
      if (!headers[h.name]) {
        throw new Error(`Missing mandatory security header: ${h.desc}`);
      }
    }
  });

  console.log('\n==================================================================');
  if (failed === 0) {
    console.log(`🎉 ALL SMOKE TESTS PASSED: ${passed} / ${passed} endpoints operational.`);
    console.log('==================================================================\n');
    process.exit(0);
  } else {
    console.error(`❌ SMOKE TESTS FAILED: ${failed} endpoint(s) failed out of ${passed + failed}.`);
    console.log('==================================================================\n');
    process.exit(1);
  }
}

runSmokeTests().catch(err => {
  console.error('Fatal Smoke Test Error:', err);
  process.exit(1);
});
