// server/services/notificationClassifier.js
// Statutory Notification Date Classifier for EXAMVERSE
// Dynamically evaluates examination dates against current timestamp.
// Classifies into:
// 1. UPCOMING
// 2. ACTIVE
// 3. CLOSING_SOON (<= 7 days remaining)
// 4. CLOSED (Application window ended, examination upcoming)
// 5. EXAMINATION_COMPLETED (Exam date in past)
// 6. RESULT_DECLARED
// 7. DATE_NOT_VERIFIED (Tentative or unconfirmed gazette)

function classifyNotificationStatus(notif, referenceDate = new Date()) {
  const now = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

  // 1. Result Declared Check
  if (notif.status === "RESULT_DECLARED") {
    return "RESULT_DECLARED";
  }
  if (notif.resultDate) {
    const resDate = new Date(notif.resultDate);
    if (!isNaN(resDate.getTime()) && resDate <= now) {
      return "RESULT_DECLARED";
    }
  }

  // 2. Date Not Verified Check (Tentative or missing key dates)
  if (notif.isDateTentative === true || (!notif.lastDate && !notif.examDate && !notif.applicationStartDate)) {
    return "DATE_NOT_VERIFIED";
  }

  // 3. Examination Completed Check
  if (notif.examDate) {
    const exDate = new Date(notif.examDate);
    if (!isNaN(exDate.getTime()) && exDate < now) {
      return "EXAMINATION_COMPLETED";
    }
  }

  // 4. Upcoming Application Check
  if (notif.applicationStartDate) {
    const startDate = new Date(notif.applicationStartDate);
    if (!isNaN(startDate.getTime()) && startDate > now) {
      return "UPCOMING";
    }
  }

  // 5. Application Window Checks (Active, Closing Soon, Closed)
  if (notif.lastDate) {
    const lastDate = new Date(notif.lastDate);
    if (!isNaN(lastDate.getTime())) {
      if (lastDate < now) {
        return "CLOSED";
      }

      // Calculate days remaining until deadline
      const diffTime = lastDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 7) {
        return "CLOSING_SOON";
      }
      return "ACTIVE";
    }
  }

  return notif.status || "ACTIVE";
}

function enrichNotification(notif, referenceDate = new Date()) {
  const now = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const liveStatus = classifyNotificationStatus(notif, now);

  let daysRemaining = null;
  if (notif.lastDate) {
    const lastDate = new Date(notif.lastDate);
    if (!isNaN(lastDate.getTime()) && lastDate >= now) {
      daysRemaining = Math.ceil((lastDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  // Extract domain from officialLink
  let sourceDomain = "Official Portal";
  try {
    const parsed = new URL(notif.officialLink);
    sourceDomain = parsed.hostname;
  } catch (e) {}

  return {
    ...notif,
    status: liveStatus,
    daysRemaining,
    sourceDomain,
    sourceVerified: Boolean(notif.officialLink && (notif.officialLink.includes('.gov.in') || notif.officialLink.includes('.nic.in') || notif.officialLink.includes('.ac.in') || notif.officialLink.includes('.in')))
  };
}

module.exports = {
  classifyNotificationStatus,
  enrichNotification
};
