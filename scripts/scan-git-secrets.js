const { execSync } = require('child_process');

console.log('--- Scanning full git history for leaked credentials ---');

// Patterns for real cloud & API secrets
const SECRET_PATTERNS = [
  { name: 'Google Gemini / Cloud API Key', regex: /AIzaSy[A-Za-z0-9_-]{33}/g },
  { name: 'Groq API Key', regex: /gsk_[A-Za-z0-9]{48,}/g },
  { name: 'OpenAI Secret Key', regex: /sk-[A-Za-z0-9]{32,}/g },
  { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'GitHub Personal Access Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/g },
  { name: 'Slack Bot Token', regex: /xoxb-[0-9]{11,13}-[0-9]{11,13}-[A-Za-z0-9]{24}/g },
  { name: 'Private RSA/EC/PGP Key', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g }
];

try {
  const diffOutput = execSync('git log -p --all', { maxBuffer: 100 * 1024 * 1024, encoding: 'utf8' });
  console.log(`Audited ${diffOutput.length} characters of commit diff history across all branches.`);

  let leaksFound = [];

  for (const pattern of SECRET_PATTERNS) {
    const matches = diffOutput.match(pattern.regex);
    if (matches) {
      // Filter out obvious documentation placeholders
      const realMatches = matches.filter(m => 
        !m.includes('your_') && 
        !m.includes('placeholder') && 
        !m.includes('example') &&
        !m.includes('0000000000') &&
        !m.includes('xxxx')
      );
      if (realMatches.length > 0) {
        leaksFound.push({ pattern: pattern.name, count: realMatches.length, sample: realMatches[0].slice(0, 8) + '...' });
      }
    }
  }

  if (leaksFound.length === 0) {
    console.log('✅ SECRET SCAN PASSED: 0 real secrets detected in entire git history.');
  } else {
    console.error('⚠️ POTENTIAL LEAKS DETECTED:', leaksFound);
    process.exit(1);
  }
} catch (err) {
  console.error('Git history scan error:', err.message);
  process.exit(1);
}
