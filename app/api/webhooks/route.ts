import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

// Resend signs webhooks with the Svix scheme. The signed payload is
// `${id}.${timestamp}.${rawBody}`, HMAC-SHA256'd with the webhook secret
// (the base64 part after the `whsec_` prefix), and delivered as a
// space-separated list of `v1,<base64sig>` entries in svix-signature.
function verifySignature(
  rawBody: string,
  headers: Headers,
  secret: string,
): boolean {
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  // Resend also forwards the combined value as resend-signature.
  const svixSignature =
    headers.get("svix-signature") ?? headers.get("resend-signature");

  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const secretBytes = Buffer.from(
    secret.startsWith("whsec_") ? secret.slice(6) : secret,
    "base64",
  );
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");
  const expectedBuf = Buffer.from(expected);

  // The header may carry multiple versioned signatures; any match passes.
  return svixSignature.split(" ").some((entry) => {
    const [, sig] = entry.split(",");
    if (!sig) return false;
    const sigBuf = Buffer.from(sig);
    return (
      sigBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(sigBuf, expectedBuf)
    );
  });
}

interface ResendWebhookEvent {
  type: string;
  data?: { email_id?: string };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RESEND_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  if (!verifySignature(rawBody, request.headers, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: ResendWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Stateless demo: just log. Real apps would update delivery status here.
  console.log(`[resend webhook] ${event.type} — email ${event.data?.email_id}`);

  return NextResponse.json({ ok: true });
}
