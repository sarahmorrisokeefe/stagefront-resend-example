// Base URL of the deployed app. Emails can't use relative paths, so image
// `src`s must be absolute, publicly hosted URLs. Set NEXT_PUBLIC_APP_URL in
// your environment (e.g. to a custom domain); falls back to the production
// deployment so images still resolve if it isn't set.
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://stagefront-resend.vercel.app";

export const LOGOMARK_URL = `${SITE_URL}/logomark-white.png`;
