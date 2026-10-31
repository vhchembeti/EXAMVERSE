// server/services/calendarExportService.js
// RFC 5545 Compliant iCalendar (.ics) Generator & Reminder Dispatcher
// Embeds VALARM notifications at 7 days, 72 hours, and 24 hours prior to application deadlines and exam shifts.

/**
 * Formats a JavaScript Date or YYYY-MM-DD string into RFC 5545 UTC timestamp (YYYYMMDDTHHMMSSZ)
 */
function formatIcsDateTime(dateInput, hour = 9, minute = 0) {
  let d;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      d = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), hour, minute, 0));
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = new Date(dateInput);
  }

  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

/**
 * Generates an RFC 5545 standard .ics file string for an array of calendar events.
 * @param {Array<Object>} events - Exam calendar events
 * @param {Object} [options]
 * @returns {string} Clean RFC 5545 iCalendar formatted text
 */
function generateIcsCalendar(events = [], options = {}) {
  const calendarName = options.calendarName || "EXAMVERSE National Examination Schedule";
  const nowStr = formatIcsDateTime(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EXAMVERSE//National Examination Ecosystem RFC5545//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${calendarName}`,
    "X-WR-TIMEZONE:Asia/Kolkata"
  ];

  events.forEach((evt, idx) => {
    const eventId = evt.id || `evt-${idx}-${Date.now()}`;
    const title = evt.title || evt.name || "Competitive Examination";
    const org = evt.organization || "Statutory Examination Authority";
    const dateStr = evt.examDate || evt.date || evt.applicationLastDate;

    if (!dateStr) return;

    const startUtc = formatIcsDateTime(dateStr, 9, 0);
    const endUtc = formatIcsDateTime(dateStr, 12, 0);

    const description = [
      `Examination: ${title}`,
      `Conducting Authority: ${org}`,
      `Category: ${evt.category || 'National / State Competitive'}`,
      `Application Closing: ${evt.applicationLastDate || 'Consult Official Gazette'}`,
      `Verified Official Domain: Trust only official statutory domains (.gov.in, .nic.in, .ac.in).`,
      `Powered by EXAMVERSE (https://examverse.in)`
    ].join("\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${eventId}@examverse.in`);
    lines.push(`DTSTAMP:${nowStr}`);
    lines.push(`DTSTART:${startUtc}`);
    lines.push(`DTEND:${endUtc}`);
    lines.push(`SUMMARY:${title}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push("LOCATION:Official Examination Centers (Pan-India / State)");
    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:OPAQUE");

    // Standard RFC 5545 Alarms:
    // 1. 7 Days Prior Reminder
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-P7D");
    lines.push("ACTION:DISPLAY");
    lines.push(`DESCRIPTION:EXAMVERSE Reminder: 7 days until ${title}`);
    lines.push("END:VALARM");

    // 2. 72 Hours (3 Days) Prior Reminder
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT72H");
    lines.push("ACTION:DISPLAY");
    lines.push(`DESCRIPTION:EXAMVERSE Urgent: 72 hours until ${title}`);
    lines.push("END:VALARM");

    // 3. 24 Hours Final Notice
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT24H");
    lines.push("ACTION:DISPLAY");
    lines.push(`DESCRIPTION:EXAMVERSE Final Notice: 24 hours until ${title}`);
    lines.push("END:VALARM");

    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

module.exports = {
  generateIcsCalendar,
  formatIcsDateTime
};
