// server/services/istLifecycleEngine.js
// Deterministic Indian Standard Time (IST) Notice Lifecycle Engine
// Timezone: Asia/Kolkata (UTC+05:30)
// Evaluates statutory notice status with mathematical precision and zero deadline leakage.

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000; // +05:30 in milliseconds
const CLOSING_SOON_THRESHOLD_HOURS = 72; // 72 hours window
const CLOSING_SOON_THRESHOLD_MS = CLOSING_SOON_THRESHOLD_HOURS * 60 * 60 * 1000;

/**
 * Convert any Date or ISO string into IST millisecond epoch
 */
function toIstEpoch(dateInput, defaultEndOfDay = false) {
  if (!dateInput) return null;
  let str = dateInput.toString().trim();
  if (!str) return null;

  // If date-only format (YYYY-MM-DD), append appropriate IST boundary
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    str += defaultEndOfDay ? 'T23:59:59+05:30' : 'T00:00:00+05:30';
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(str)) {
    str += '+05:30';
  }

  const parsed = new Date(str).getTime();
  return isNaN(parsed) ? null : parsed;
}

/**
 * Format timestamp to readable Indian Standard Time string
 */
function formatIst(timestamp) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(d) + ' IST';
}

/**
 * Pure Deterministic IST Notice Status Evaluator
 * 
 * Enforces Hard Invariant: A past deadline CAN NEVER render as ACTIVE or CLOSING_SOON.
 * 
 * @param {Object} notice - Notification object with dates and event flags
 * @param {number|Date} [nowEpoch=Date.now()] - Current evaluation timestamp
 * @returns {Object} Comprehensive lifecycle evaluation
 */
function evaluateNoticeLifecycle(notice, nowEpoch = Date.now()) {
  const now = typeof nowEpoch === 'number' ? nowEpoch : new Date(nowEpoch).getTime();

  // If result is officially declared, highest operational priority
  if (notice.resultDeclared || notice.status === 'RESULT_DECLARED') {
    return {
      status: 'RESULT_DECLARED',
      badgeText: 'Result Declared',
      badgeColor: 'emerald',
      isApplicationOpen: false,
      isClosingSoon: false,
      isPastDeadline: true,
      hoursRemaining: null,
      computedDeadlineIst: null,
      explanation: 'Official merit list or scorecard published on verified board portal.'
    };
  }

  // Check for extended deadline via corrigendum
  const effectiveDeadlineRaw = notice.corrigendumDeadline || notice.extendedDeadline || notice.applicationDeadline;
  const startDateEpoch = toIstEpoch(notice.applicationStartDate, false);
  const deadlineEpoch = toIstEpoch(effectiveDeadlineRaw, true); // defaults to 23:59:59 IST if date-only
  const examDateEpoch = toIstEpoch(notice.examinationDate, true);

  // If no verified deadline exists
  if (!deadlineEpoch) {
    return {
      status: 'DATE_NOT_VERIFIED',
      badgeText: 'Date Not Verified',
      badgeColor: 'slate',
      isApplicationOpen: false,
      isClosingSoon: false,
      isPastDeadline: false,
      hoursRemaining: null,
      computedDeadlineIst: null,
      explanation: 'Statutory gazette notification published; specific deadline pending official release.'
    };
  }

  const msRemaining = deadlineEpoch - now;
  const hoursRemaining = msRemaining > 0 ? parseFloat((msRemaining / (1000 * 60 * 60)).toFixed(1)) : 0;
  const isPastDeadline = now > deadlineEpoch;

  // HARD INVARIANT CHECK
  if (isPastDeadline) {
    // Has examination also concluded?
    if (examDateEpoch && now > examDateEpoch) {
      if (notice.answerKeyReleased) {
        return {
          status: 'ANSWER_KEY_RELEASED',
          badgeText: 'Answer Key Released',
          badgeColor: 'purple',
          isApplicationOpen: false,
          isClosingSoon: false,
          isPastDeadline: true,
          hoursRemaining: 0,
          computedDeadlineIst: formatIst(deadlineEpoch),
          explanation: 'Examination completed and provisional/final answer keys are available.'
        };
      }
      return {
        status: 'EXAMINATION_COMPLETED',
        badgeText: 'Exam Completed',
        badgeColor: 'slate',
        isApplicationOpen: false,
        isClosingSoon: false,
        isPastDeadline: true,
        hoursRemaining: 0,
        computedDeadlineIst: formatIst(deadlineEpoch),
        explanation: 'Examination session has concluded; awaiting answer key or merit list publication.'
      };
    }

    if (notice.admitCardReleased) {
      return {
        status: 'ADMIT_CARD_RELEASED',
        badgeText: 'Admit Card Released',
        badgeColor: 'blue',
        isApplicationOpen: false,
        isClosingSoon: false,
        isPastDeadline: true,
        hoursRemaining: 0,
        computedDeadlineIst: formatIst(deadlineEpoch),
        explanation: 'Registration closed. Official e-admit cards / hall tickets published for download.'
      };
    }

    return {
      status: 'CLOSED',
      badgeText: 'Application Closed',
      badgeColor: 'rose',
      isApplicationOpen: false,
      isClosingSoon: false,
      isPastDeadline: true,
      hoursRemaining: 0,
      computedDeadlineIst: formatIst(deadlineEpoch),
      explanation: `Registration window closed on ${formatIst(deadlineEpoch)}.`
    };
  }

  // If application has not opened yet
  if (startDateEpoch && now < startDateEpoch) {
    return {
      status: 'UPCOMING',
      badgeText: 'Upcoming Notification',
      badgeColor: 'indigo',
      isApplicationOpen: false,
      isClosingSoon: false,
      isPastDeadline: false,
      hoursRemaining,
      computedDeadlineIst: formatIst(deadlineEpoch),
      explanation: `Application registration scheduled to open on ${formatIst(startDateEpoch)}.`
    };
  }

  // Application is currently open: Check for corrigendum extension
  const isCorrigendumActive = Boolean(notice.corrigendumDeadline || notice.corrigendumActive || notice.extendedDeadline);

  // Application is currently open: Check for Closing Soon (<= 72 hours)
  if (msRemaining <= CLOSING_SOON_THRESHOLD_MS) {
    return {
      status: isCorrigendumActive ? 'CORRIGENDUM_EXTENDED' : 'CLOSING_SOON',
      corrigendumExtended: isCorrigendumActive,
      badgeText: isCorrigendumActive ? 'Deadline Extended (Closing Soon)' : `Closing Soon (${hoursRemaining}h left)`,
      badgeColor: 'amber',
      isApplicationOpen: true,
      isClosingSoon: true,
      isPastDeadline: false,
      hoursRemaining,
      computedDeadlineIst: formatIst(deadlineEpoch),
      explanation: `Urgent: Application registration closes in ${hoursRemaining} hours on ${formatIst(deadlineEpoch)}.`
    };
  }

  return {
    status: isCorrigendumActive ? 'CORRIGENDUM_EXTENDED' : 'ACTIVE',
    corrigendumExtended: isCorrigendumActive,
    badgeText: isCorrigendumActive ? 'Corrigendum Active (Extended)' : 'Active Application Window',
    badgeColor: 'emerald',
    isApplicationOpen: true,
    isClosingSoon: false,
    isPastDeadline: false,
    hoursRemaining,
    computedDeadlineIst: formatIst(deadlineEpoch),
    explanation: `Application window is open until ${formatIst(deadlineEpoch)}.`
  };
}

module.exports = {
  evaluateNoticeLifecycle,
  toIstEpoch,
  formatIst,
  CLOSING_SOON_THRESHOLD_HOURS
};
