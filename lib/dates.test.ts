import { describe, it, expect } from "vitest";
import { formatShowDate, reminderTimeFor } from "./dates";

describe("formatShowDate", () => {
  it("formats as 'Wkd, Mon D YYYY' with no comma before the year", () => {
    expect(formatShowDate("2026-07-18")).toMatch(/^\w{3}, Jul 18 2026$/);
  });

  it("is timezone-safe — the calendar date never shifts", () => {
    // Naive `new Date("2026-01-01")` can roll back a day in negative-offset
    // zones; pinning to UTC keeps Jan 1 as Jan 1 regardless of the host TZ.
    expect(formatShowDate("2026-01-01")).toMatch(/Jan 1 2026$/);
    expect(formatShowDate("2026-03-15")).toContain("Mar 15 2026");
  });
});

describe("reminderTimeFor", () => {
  it("returns 8pm UTC the night before a future show", () => {
    expect(reminderTimeFor("2099-07-18")).toBe("2099-07-17T20:00:00.000Z");
  });

  it("returns null when the reminder time is already in the past", () => {
    expect(reminderTimeFor("2020-01-01")).toBeNull();
  });
});
