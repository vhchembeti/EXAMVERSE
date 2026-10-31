// server/services/intervalTreeClashEngine.js
// Augmented Interval Tree for High-Performance Examination Scheduling Clash Detection
// Detects HARD_CLASH (same shift / overlapping timestamps) and TRAVEL_LOGISTICS_RISK (<24h buffer)

class IntervalTreeNode {
  constructor(startMs, endMs, event) {
    this.startMs = startMs;
    this.endMs = endMs;
    this.maxEndMs = endMs;
    this.event = event;
    this.left = null;
    this.right = null;
  }
}

class IntervalTree {
  constructor() {
    this.root = null;
  }

  insert(startMs, endMs, event) {
    this.root = this._insertNode(this.root, startMs, endMs, event);
  }

  _insertNode(node, startMs, endMs, event) {
    if (!node) {
      return new IntervalTreeNode(startMs, endMs, event);
    }

    if (startMs < node.startMs) {
      node.left = this._insertNode(node.left, startMs, endMs, event);
    } else {
      node.right = this._insertNode(node.right, startMs, endMs, event);
    }

    node.maxEndMs = Math.max(node.maxEndMs, endMs);
    if (node.left) node.maxEndMs = Math.max(node.maxEndMs, node.left.maxEndMs);
    if (node.right) node.maxEndMs = Math.max(node.maxEndMs, node.right.maxEndMs);

    return node;
  }

  /**
   * Finds all intervals overlapping with [startMs, endMs]
   */
  findOverlaps(startMs, endMs) {
    const overlaps = [];
    this._searchOverlaps(this.root, startMs, endMs, overlaps);
    return overlaps;
  }

  _searchOverlaps(node, startMs, endMs, overlaps) {
    if (!node) return;

    // Check overlap: max(start1, start2) <= min(end1, end2)
    if (Math.max(node.startMs, startMs) <= Math.min(node.endMs, endMs)) {
      overlaps.push(node.event);
    }

    if (node.left && node.left.maxEndMs >= startMs) {
      this._searchOverlaps(node.left, startMs, endMs, overlaps);
    }

    this._searchOverlaps(node.right, startMs, endMs, overlaps);
  }
}

/**
 * Parses date string (YYYY-MM-DD) and optional shift into millisecond start/end intervals.
 * Default shift is 09:00 to 12:00 for morning, 14:00 to 17:00 for afternoon.
 */
function parseEventInterval(event) {
  const dateStr = event.examDate || event.date || event.applicationLastDate;
  if (!dateStr) return null;

  const dateParts = dateStr.split('-');
  if (dateParts.length !== 3) return null;

  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);

  let startHour = 9;
  let endHour = 12;

  if (event.shift === 'AFTERNOON' || event.shift === 'SHIFT_2') {
    startHour = 14;
    endHour = 17;
  } else if (event.shift === 'EVENING' || event.shift === 'SHIFT_3') {
    startHour = 17;
    endHour = 20;
  }

  const startMs = new Date(Date.UTC(year, month, day, startHour, 0, 0)).getTime();
  const endMs = new Date(Date.UTC(year, month, day, endHour, 0, 0)).getTime();

  return { startMs, endMs, dateStr };
}

/**
 * Analyzes an array of candidate exam events and returns structured conflict telemetry.
 * @param {Array<Object>} events - Exam events
 * @returns {Object} Comprehensive clash report with HARD_CLASH and TRAVEL_LOGISTICS_RISK
 */
function detectClashes(events = []) {
  const validEvents = [];
  events.forEach(evt => {
    const interval = parseEventInterval(evt);
    if (interval) {
      validEvents.push({
        ...evt,
        _interval: interval
      });
    }
  });

  // Sort chronologically by start timestamp
  validEvents.sort((a, b) => a._interval.startMs - b._interval.startMs);

  const tree = new IntervalTree();
  const hardClashes = [];
  const travelRisks = [];
  const deadlineClashes = [];

  const seenHardClashPairs = new Set();
  const seenTravelRiskPairs = new Set();

  for (let i = 0; i < validEvents.length; i++) {
    const current = validEvents[i];
    const { startMs, endMs } = current._interval;

    // 1. Search for overlapping intervals in the Interval Tree (HARD_CLASH)
    const overlaps = tree.findOverlaps(startMs, endMs);
    overlaps.forEach(prior => {
      if (prior.id !== current.id) {
        const pairKey = [prior.id, current.id].sort().join(':::');
        if (!seenHardClashPairs.has(pairKey)) {
          seenHardClashPairs.add(pairKey);
          hardClashes.push({
            type: "HARD_CLASH",
            severity: "CRITICAL",
            eventA: { id: prior.id, title: prior.title, date: prior._interval.dateStr, shift: prior.shift || 'MORNING' },
            eventB: { id: current.id, title: current.title, date: current._interval.dateStr, shift: current.shift || 'MORNING' },
            message: `Direct exam schedule overlap on ${current._interval.dateStr}: Cannot appear for both '${prior.title}' and '${current.title}'.`,
            recommendedAction: "Candidate must select one primary target exam or verify if organizing bodies offer alternate sessions or refund window."
          });
        }
      }
    });

    // 2. Search for Travel Logistics Risk (< 24 hours separation)
    for (let j = 0; j < i; j++) {
      const prior = validEvents[j];
      const separationMs = current._interval.startMs - prior._interval.endMs;

      // Between 0 and 24 hours of separation
      if (separationMs > 0 && separationMs <= 24 * 60 * 60 * 1000) {
        const pairKey = [prior.id, current.id].sort().join(':::');
        if (!seenTravelRiskPairs.has(pairKey) && !seenHardClashPairs.has(pairKey)) {
          seenTravelRiskPairs.add(pairKey);
          const hoursApart = Number((separationMs / (1000 * 60 * 60)).toFixed(1));
          travelRisks.push({
            type: "TRAVEL_LOGISTICS_RISK",
            severity: "WARNING",
            separationHours: hoursApart,
            eventA: { id: prior.id, title: prior.title, date: prior._interval.dateStr },
            eventB: { id: current.id, title: current.title, date: current._interval.dateStr },
            message: `Only ${hoursApart} hours buffer between '${prior.title}' and '${current.title}'.`,
            recommendedAction: "Ensure both exam test centers are allocated in the same city, or arrange transit logistics well in advance to prevent missing reporting time."
          });
        }
      }
    }

    // Insert current into interval tree for subsequent comparisons
    tree.insert(startMs, endMs, current);
  }

  // 3. Application Deadline Clashes (Same closing date)
  const deadlineMap = new Map();
  events.forEach(evt => {
    if (evt.applicationLastDate) {
      if (!deadlineMap.has(evt.applicationLastDate)) {
        deadlineMap.set(evt.applicationLastDate, []);
      }
      deadlineMap.get(evt.applicationLastDate).push(evt);
    }
  });

  deadlineMap.forEach((matchedEvents, dateStr) => {
    if (matchedEvents.length > 1) {
      deadlineClashes.push({
        type: "DEADLINE_CLASH",
        severity: "ADVISORY",
        date: dateStr,
        count: matchedEvents.length,
        exams: matchedEvents.map(e => ({ id: e.id, title: e.title, organization: e.organization })),
        message: `${matchedEvents.length} exam application windows close simultaneously on ${dateStr}. Complete fee payment 48 hours prior to avoid server traffic crashes.`
      });
    }
  });

  const totalClashes = hardClashes.length + travelRisks.length;

  return {
    success: true,
    totalEventsAnalyzed: events.length,
    clashSummary: {
      totalClashes,
      hardClashCount: hardClashes.length,
      travelRiskCount: travelRisks.length,
      deadlineClashCount: deadlineClashes.length,
      status: hardClashes.length > 0 ? "CONFLICTS_DETECTED" : travelRisks.length > 0 ? "LOGISTICS_RISK" : "CLEAR_SCHEDULE"
    },
    hardClashes,
    travelRisks,
    deadlineClashes
  };
}

module.exports = {
  IntervalTree,
  detectClashes,
  parseEventInterval
};
