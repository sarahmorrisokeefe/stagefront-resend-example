// Pure date helpers for show dates. Kept separate from the route handler so
// they can be unit-tested without pulling in the email/PDF machinery.

/** Format "2026-07-18" as "Fri, Jul 18 2026" without tripping over timezones. */
export function formatShowDate(date: string): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
  // Intl gives "Fri, Jul 18, 2026" — drop the comma before the year.
  return formatted.replace(/,(\s\d{4})$/, "$1");
}

/** 8pm the night before the show, as an ISO string (or null if already past). */
export function reminderTimeFor(date: string): string | null {
  const showMidnightUtc = new Date(`${date}T00:00:00Z`).getTime();
  const dayBefore = new Date(showMidnightUtc - 24 * 60 * 60 * 1000);
  dayBefore.setUTCHours(20, 0, 0, 0); // 8pm UTC — good enough for a demo
  if (dayBefore.getTime() <= Date.now()) return null;
  return dayBefore.toISOString();
}
