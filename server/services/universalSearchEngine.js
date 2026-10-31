// server/services/universalSearchEngine.js
// Universal Examination & Authority Search Engine for EXAMVERSE
// Features Typo-Tolerant Fuzzy Search, Indian Exam Synonym Expansion,
// Multi-Facet Filtering, and Structured Query Syntax (e.g., 'authority:UPSC status:ACTIVE').

const SYNONYM_MAP = {
  // Engineering disciplines
  'ec': ['ec', 'ece', 'electronics', 'telecommunication', 'electronics and communication'],
  'ece': ['ece', 'ec', 'electronics', 'telecommunication', 'electronics and communication'],
  'cs': ['cs', 'cse', 'computer science', 'it', 'information technology', 'software'],
  'cse': ['cse', 'cs', 'computer science', 'it', 'information technology'],
  'me': ['me', 'mech', 'mechanical', 'mechanical engineering'],
  'mech': ['mech', 'me', 'mechanical', 'mechanical engineering'],
  'ce': ['ce', 'civil', 'civil engineering'],
  'civil': ['civil', 'ce', 'civil engineering'],
  'ee': ['ee', 'eee', 'electrical', 'electrical engineering'],
  'eee': ['eee', 'ee', 'electrical', 'electrical engineering'],

  // Exam Acronyms & Titles
  'ies': ['ies', 'ese', 'engineering services examination', 'upsc ese', 'railway engineering'],
  'ese': ['ese', 'ies', 'engineering services examination', 'upsc ese'],
  'ias': ['ias', 'civil services', 'upsc cse', 'collector', 'cse'],
  'ips': ['ips', 'civil services', 'upsc cse', 'police officer', 'cse'],
  'cgl': ['cgl', 'ssc cgl', 'combined graduate level'],
  'chsl': ['chsl', 'ssc chsl', 'combined higher secondary level'],
  'bank po': ['bank po', 'ibps po', 'sbi po', 'probationary officer', 'po'],
  'po': ['po', 'bank po', 'ibps po', 'sbi po', 'probationary officer'],
  'clerk': ['clerk', 'ibps clerk', 'sbi clerk', 'junior associate', 'office assistant'],
  'rrb': ['rrb', 'railway recruitment', 'railways', 'ntpc', 'alp', 'loco pilot'],
  'ntpc': ['ntpc', 'rrb ntpc', 'non technical popular categories'],
  'alp': ['alp', 'rrb alp', 'assistant loco pilot'],
  'net': ['net', 'ugc net', 'csir net', 'jrf', 'junior research fellowship', 'assistant professor'],
  'jrf': ['jrf', 'junior research fellowship', 'csir net', 'ugc net'],
  'gate': ['gate', 'graduate aptitude test in engineering', 'psu', 'mtech'],
  'cat': ['cat', 'common admission test', 'iim', 'mba']
};

/**
 * Expand query tokens with known synonyms
 */
function expandQueryTokens(query) {
  if (!query) return [];
  const clean = query.toLowerCase().trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  const expanded = new Set(tokens);

  // Check full query first (e.g. "bank po")
  if (SYNONYM_MAP[clean]) {
    SYNONYM_MAP[clean].forEach(syn => expanded.add(syn.toLowerCase()));
  }

  // Check individual tokens
  tokens.forEach(tok => {
    if (SYNONYM_MAP[tok]) {
      SYNONYM_MAP[tok].forEach(syn => expanded.add(syn.toLowerCase()));
    }
  });

  return Array.from(expanded);
}

/**
 * Parse structured researcher query syntax (e.g. 'authority:UPSC status:ACTIVE')
 */
function parseQuerySyntax(rawQuery) {
  const filters = {};
  let freeText = (rawQuery || '').trim();

  // Pattern: key:value
  const directiveRegex = /(\w+):([^\s]+)/g;
  let match;
  while ((match = directiveRegex.exec(rawQuery)) !== null) {
    const key = match[1].toLowerCase();
    const val = match[2];
    filters[key] = val;
    // Strip from free text
    freeText = freeText.replace(match[0], '').trim();
  }

  return { freeText, structuredFilters: filters, filters };
}

/**
 * Calculate match score for an examination against search tokens
 */
function calculateRelevanceScore(exam, tokens) {
  if (!tokens || tokens.length === 0) return 1;

  let score = 0;
  const searchableText = [
    exam.code || '',
    exam.title || '',
    exam.conductingBody || '',
    exam.category || '',
    exam.shortDescription || '',
    exam.eligibility?.minQualification || '',
    (exam.eligibility?.allowedDegrees || []).join(' '),
    (exam.eligibility?.specializations || []).join(' ')
  ].join(' ').toLowerCase();

  tokens.forEach(token => {
    // Exact code match = highest weight
    if ((exam.code || '').toLowerCase() === token) {
      score += 50;
    } else if ((exam.code || '').toLowerCase().includes(token)) {
      score += 25;
    }

    // Title match
    if ((exam.title || '').toLowerCase().includes(token)) {
      score += 20;
    }

    // Conducting body match
    if ((exam.conductingBody || '').toLowerCase().includes(token)) {
      score += 15;
    }

    // Body text match
    if (searchableText.includes(token)) {
      score += 5;
    }
  });

  return score;
}

/**
 * Universal Search & Multi-Facet Filtering
 */
function executeUniversalSearch(exams = [], options = {}) {
  const opts = typeof options === 'string' ? { query: options } : (options || {});
  const {
    query = opts.q || '',
    state = 'ALL',
    authority = '',
    sector = '',
    qualification = '',
    status = '',
    minAge = null,
    maxAge = null
  } = opts;

  const { freeText, structuredFilters } = parseQuerySyntax(query);
  const activeAuthority = structuredFilters.authority || authority;
  const activeStatus = structuredFilters.status || status;
  const activeState = structuredFilters.state || state;
  const activeSector = structuredFilters.sector || sector;

  const searchTokens = expandQueryTokens(freeText);

  const filtered = exams.filter(exam => {
    // 1. State filter
    if (activeState && activeState !== 'ALL') {
      const matchState = exam.scope === 'All India' || exam.stateCode === activeState;
      if (!matchState) return false;
    }

    // 2. Authority filter
    if (activeAuthority) {
      const authLower = activeAuthority.toLowerCase();
      const matchAuth = (exam.conductingBody || '').toLowerCase().includes(authLower) ||
                        (exam.code || '').toLowerCase().includes(authLower);
      if (!matchAuth) return false;
    }

    // 3. Sector / Category filter
    if (activeSector && activeSector !== 'ALL') {
      const secLower = activeSector.toLowerCase();
      const matchSec = (exam.category || '').toLowerCase().includes(secLower);
      if (!matchSec) return false;
    }

    // 4. Qualification filter
    if (qualification && qualification !== 'ALL') {
      const qualLower = qualification.toLowerCase();
      const matchQual = (exam.eligibility?.minQualification || '').toLowerCase().includes(qualLower) ||
                        (exam.eligibility?.allowedDegrees || []).some(d => d.toLowerCase().includes(qualLower));
      if (!matchQual) return false;
    }

    // 5. Age filter
    if (minAge !== null && exam.eligibility?.maxAge && exam.eligibility.maxAge < minAge) {
      return false;
    }
    if (maxAge !== null && exam.eligibility?.minAge && exam.eligibility.minAge > maxAge) {
      return false;
    }

    // 6. Free text match score
    if (searchTokens.length > 0) {
      const score = calculateRelevanceScore(exam, searchTokens);
      if (score === 0) return false;
      exam._relevanceScore = score;
    } else {
      exam._relevanceScore = 1;
    }

    return true;
  });

  // Sort by relevance score descending
  return filtered.sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
}

module.exports = {
  SYNONYM_MAP,
  expandQueryTokens,
  parseQuerySyntax,
  parseSearchQuery: parseQuerySyntax,
  calculateRelevanceScore,
  executeUniversalSearch,
  searchExams: executeUniversalSearch
};
