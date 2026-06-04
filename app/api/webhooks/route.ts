import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/webhook-signature";

export const runtime = "nodejs";

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
