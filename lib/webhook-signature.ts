import crypto from "node:crypto";

// Resend signs webhooks with the Svix scheme. The signed payload is
// `${id}.${timestamp}.${rawBody}`, HMAC-SHA256'd with the webhook secret
// (the base64 part after the `whsec_` prefix), and delivered as a
// space-separated list of `v1,<base64sig>` entries in svix-signature.
export function verifySignature(
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
