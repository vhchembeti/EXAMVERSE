// server/middleware/securityHeaders.js
// OWASP ASVS v4.0 Level 2 Security Headers & Structured Log PII Redaction Middleware

/**
 * Express middleware that enforces production-grade security headers
 */
function applySecurityHeaders(req, res, next) {
  // 1. Content Security Policy (CSP) with report-uri and privacy-enhanced YouTube frame
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; frame-src 'self' https://www.youtube-nocookie.com; connect-src 'self' http://localhost:* https://*.lhr.life https://*.render.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; report-uri /api/security/csp-report;"
  );

  // 2. Strict Transport Security (HSTS) - 1 Year with preload
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 3. MIME Sniffing Protection
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 4. Clickjacking Prevention
  res.setHeader('X-Frame-Options', 'DENY');

  // 5. Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Cross-Site Scripting Filter Guard
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 7. Browser Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // 8. Prevent Cross-Domain Policy Leakage
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

  // 9. Cross-Origin Opener Policy (COOP)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  next();
}

/**
 * Sanitizes strings or JSON objects to mask sensitive PII (Aadhaar, PAN, phone, passwords, tokens)
 */
function sanitizePiiForLogs(data) {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return data
      // Redact 12-digit Aadhaar numbers
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, 'XXXX-XXXX-REDACTED')
      // Redact 10-character Indian PAN cards
      .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi, 'PAN-REDACTED')
      // Redact 10-digit mobile phone numbers
      .replace(/\b[6-9]\d{9}\b/g, 'PHONE-REDACTED')
      // Redact Bearer tokens
      .replace(/Bearer\s+[a-zA-Z0-9\-_.]+/gi, 'Bearer REDACTED_TOKEN')
      // Redact password parameters
      .replace(/"password":\s*"[^"]+"/gi, '"password":"[REDACTED]"');
  }

  if (typeof data === 'object') {
    try {
      const cloned = JSON.parse(JSON.stringify(data));
      const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'mobileNumber', 'phone', 'dateOfBirth', 'casteCategory'];

      const redactObj = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        for (const k of Object.keys(obj)) {
          if (sensitiveKeys.includes(k)) {
            obj[k] = '[REDACTED]';
          } else if (typeof obj[k] === 'object') {
            redactObj(obj[k]);
          }
        }
      };
      redactObj(cloned);
      return cloned;
    } catch {
      return data;
    }
  }

  return data;
}

module.exports = {
  applySecurityHeaders,
  sanitizePiiForLogs
};
