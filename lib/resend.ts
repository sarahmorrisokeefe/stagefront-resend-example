import { Resend } from "resend";

// Single shared client. Reusing one instance avoids re-creating the
// underlying fetch wrapper on every request in a warm serverless container.
export const resend = new Resend(process.env.RESEND_API_KEY);
