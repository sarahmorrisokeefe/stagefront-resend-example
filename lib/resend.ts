import { Resend } from 'resend';

// Lazily constructed singleton. The Resend SDK throws if instantiated without
// an API key, and `next build` imports this module while collecting page data
// — before any runtime env vars exist — so constructing eagerly fails the
// build. Defer construction to first use (request time), then cache it.
//
// NOTE: Resend's docs show the simpler eager form:
//   export const resend = new Resend(process.env.RESEND_API_KEY)
// That's perfect when the key is guaranteed present at build/import time. We
// deliberately diverge so the build still succeeds when the key is absent at
// build time (a fresh deploy before env vars are set, CI, preview builds).
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
