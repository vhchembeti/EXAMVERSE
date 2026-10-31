// scripts/load-test.js
// Automated Concurrency & High-Throughput Load Testing Engine
// Simulates concurrent virtual users against core statutory endpoints and records p50/p95/p99 latencies.

const http = require('http');

const SERVER_PORT = process.env.PORT || 5000;
const BASE_HOST = '127.0.0.1';

const ENDPOINTS = [
  { path: '/api/health', method: 'GET' },
  { path: '/api/exams?search=UPSC', method: 'GET' },
  { path: '/api/gate/papers/CS', method: 'GET' },
  { path: '/api/career-pathways/topological-sort', method: 'GET' },
  {
    path: '/api/eligibility/evaluate',
    method: 'POST',
    body: JSON.stringify({
      age: 24,
      educationLevel: "Bachelor's degree",
      degree: "B.Tech",
      branch: "Computer Science and Engineering",
      graduationStatus: "Completed",
      percentage: 78.5,
      casteCategory: "General",
      domicileState: "AP",
      nationality: "Indian"
    })
  }
];

function makeRequest(target) {
  return new Promise((resolve) => {
    const start = Date.now();
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Email': 'loadtest@examverse.in',
      'X-Bypass-Ratelimit': 'examverse_load_test_token_2026'
    };

    if (target.body) {
      headers['Content-Length'] = Buffer.byteLength(target.body);
    }

    const req = http.request(
      {
        hostname: BASE_HOST,
        port: SERVER_PORT,
        path: target.path,
        method: target.method,
        headers,
        timeout: 5000
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          const duration = Date.now() - start;
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            durationMs: duration
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        success: false,
        statusCode: 0,
        error: err.message,
        durationMs: Date.now() - start
      });
    });

    if (target.body) {
      req.write(target.body);
    }
    req.end();
  });
}

async function runLoadTest(totalRequests = 500, concurrency = 50) {
  console.log('===============================================================');
  console.log('  EXAMVERSE CONCURRENCY & LATENCY LOAD TESTING');
  console.log('===============================================================');
  console.log(`  Total Requests:   ${totalRequests}`);
  console.log(`  Concurrency:      ${concurrency} concurrent workers`);
  console.log(`  Target Host:      http://${BASE_HOST}:${SERVER_PORT}`);
  console.log('===============================================================\n');

  const testStartTime = Date.now();
  const durations = [];
  let successfulRequests = 0;
  let failedRequests = 0;

  let requestIndex = 0;

  async function worker() {
    while (requestIndex < totalRequests) {
      const idx = requestIndex++;
      const endpoint = ENDPOINTS[idx % ENDPOINTS.length];
      const res = await makeRequest(endpoint);
      durations.push(res.durationMs);
      if (res.success) {
        successfulRequests++;
      } else {
        failedRequests++;
      }
    }
  }

  // Launch concurrent workers
  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  const totalTimeSeconds = (Date.now() - testStartTime) / 1000;
  durations.sort((a, b) => a - b);

  const p50 = durations[Math.floor(durations.length * 0.50)];
  const p90 = durations[Math.floor(durations.length * 0.90)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const minLatency = durations[0];
  const maxLatency = durations[durations.length - 1];
  const throughput = Number((totalRequests / totalTimeSeconds).toFixed(2));

  const results = {
    totalRequests,
    concurrency,
    successfulRequests,
    failedRequests,
    successRate: `${((successfulRequests / totalRequests) * 100).toFixed(1)}%`,
    totalTimeSeconds: Number(totalTimeSeconds.toFixed(2)),
    throughputReqSec: throughput,
    latency: {
      minMs: minLatency,
      p50Ms: p50,
      p90Ms: p90,
      p95Ms: p95,
      p99Ms: p99,
      maxMs: maxLatency
    },
    statutoryServiceLevelAgreement: {
      p95Target: "< 250 ms",
      p95Observed: `${p95} ms`,
      slaStatus: p95 <= 250 ? "COMPLIANT" : "INVESTIGATE"
    }
  };

  console.log('--- RESULTS SUMMARY ---');
  console.log(`  Success Rate:     ${results.successRate} (${successfulRequests}/${totalRequests})`);
  console.log(`  Throughput:       ${throughput} req/sec`);
  console.log(`  Latency p50:      ${p50} ms`);
  console.log(`  Latency p90:      ${p90} ms`);
  console.log(`  Latency p95:      ${p95} ms (SLA Target: < 250 ms)`);
  console.log(`  Latency p99:      ${p99} ms`);
  console.log(`  Min / Max:        ${minLatency} ms / ${maxLatency} ms`);
  console.log('===============================================================\n');

  return results;
}

if (require.main === module) {
  runLoadTest(500, 50).catch(console.error);
}

module.exports = { runLoadTest };
