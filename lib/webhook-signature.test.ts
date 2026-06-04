import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifySignature } from "./webhook-signature";

const SECRET = "whsec_" + Buffer.from("test-signing-key").toString("base64");
const ID = "msg_123";
const TS = "1700000000";
const BODY = JSON.stringify({ type: "email.delivered", data: { email_id: "em_1" } });

/** Produce a valid Svix-style signature the way Resend does. */
function sign(body: string): string {
  const key = Buffer.from(SECRET.slice(6), "base64");
  return crypto
    .createHmac("sha256", key)
    .update(`${ID}.${TS}.${body}`)
    .digest("base64");
}

function headers(map: Record<string, string>): Headers {
  return new Headers(map);
}

describe("verifySignature", () => {
  it("accepts a correctly signed payload", () => {
    const ok = verifySignature(
      BODY,
      headers({ "svix-id": ID, "svix-timestamp": TS, "svix-signature": `v1,${sign(BODY)}` }),
      SECRET,
    );
    expect(ok).toBe(true);
  });

  it("rejects a tampered signature", () => {
    const ok = verifySignature(
      BODY,
      headers({ "svix-id": ID, "svix-timestamp": TS, "svix-signature": "v1,bogus" }),
      SECRET,
    );
    expect(ok).toBe(false);
  });

  it("rejects when the body was modified after signing", () => {
    const ok = verifySignature(
      '{"tampered":true}',
      headers({ "svix-id": ID, "svix-timestamp": TS, "svix-signature": `v1,${sign(BODY)}` }),
      SECRET,
    );
    expect(ok).toBe(false);
  });

  it("rejects when signature headers are missing", () => {
    expect(verifySignature(BODY, headers({}), SECRET)).toBe(false);
  });
});
