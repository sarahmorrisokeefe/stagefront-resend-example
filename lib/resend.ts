import { Resend } from 'resend';

// Lazily constructed singleton. The Resend SDK throws if instantiated without
// an API key, and `next build` imports this module while collecting page data
// — before any runtime env vars exist — so constructing eagerly fails the
// build. Defer construction to first use (request time), then cache it.
let instance: Resend | null = null;

function client(): Resend {
  if (!instance) {
    instance = new Resend(process.env.RESEND_API_KEY);
  }
  return instance;
}

// Exposed as a named client (per spec) via a proxy so existing call sites
// like `resend.emails.send(...)` keep working unchanged, while construction
// is deferred until the first property access at runtime.
export const resend = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    return Reflect.get(client(), prop, receiver);
  },
});
