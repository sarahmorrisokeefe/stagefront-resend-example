import { describe, it, expect } from "vitest";
import { generateTicketNumber } from "./ticket-number";

describe("generateTicketNumber", () => {
  it("matches the SF- prefix with an 8-char suffix", () => {
    expect(generateTicketNumber()).toMatch(
      /^SF-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/,
    );
  });

  it("never uses ambiguous characters (0 O 1 I)", () => {
    const suffix = generateTicketNumber().slice(3);
    expect(suffix).not.toMatch(/[01OI]/);
  });

  it("is collision-free across many generations", () => {
    const ids = new Set(
      Array.from({ length: 1000 }, () => generateTicketNumber()),
    );
    expect(ids.size).toBe(1000);
  });
});
