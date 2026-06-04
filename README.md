# Stagefront

A minimal indie-show ticket confirmation demo built on Resend.

**[▶ Live demo](https://stagefront-resend.vercel.app)**

<img width="730" height="523" alt="Screenshot 2026-06-03 at 3 10 36 PM" src="https://github.com/user-attachments/assets/aa584fe7-1fb9-4d66-bed9-b05cfb2bd563" />

Stagefront is a ticket confirmation app for indie shows. It sends a PDF ticket on purchase, schedules a reminder the night before the show, and uses webhooks to confirm every email is delivered. It's built for developers working with indie venues who need email infrastructure without fuss.

## Features

- **Transactional email** — confirmation sent the moment a fan claims a ticket
- **React Email templates** — confirmation + reminder designed in JSX, not raw HTML
- **PDF ticket attachment** — generated per request and attached to the email
- **Idempotency keys** — duplicate submits/retries never send twice
- **Scheduled send** — reminder automatically delivered the night before the show
- **Webhooks** — delivery / bounce / complaint events verified and logged

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- [Resend](https://resend.com) Node SDK + [React Email](https://react.email)
- `@react-pdf/renderer` for the PDF ticket
- Deployed on Vercel

## How it works

A fan submits their info, and Stagefront fires two API calls to Resend: one that delivers a confirmation email + attachment of a PDF ticket, and one scheduled to send the night before the show. A webhook endpoint listens in the background to confirm each email arrived as expected.

```
Form (app/page.tsx)
  └─ POST /api/send
       ├─ generate a ticket number
       ├─ render the PDF ticket
       ├─ send confirmation email (PDF attached)   ── idempotency key
       └─ schedule reminder for 8pm the night before ── idempotency key

Resend ──▶ POST /api/webhooks   (delivery / bounce / complaint events)
```

## Getting started

### Prerequisites

- Node 18+
- A Resend account and API key
- A verified domain (only needed to email anyone other than your own Resend account address; see [Resend setup](#resend-setup))

### Setup

```bash
git clone https://github.com/sarahmorrisokeefe/stagefront-resend-example.git
cd stagefront-resend-example
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

Then open http://localhost:3000

### Environment variables

| Variable                | Required     | Description                                                              |
| ----------------------- | ------------ | ------------------------------------------------------------------------ |
| `RESEND_API_KEY`        | Yes          | Your Resend API key (`re_…`), from resend.com/api-keys                   |
| `FROM_EMAIL`            | Yes          | Verified sender address. Use `onboarding@resend.dev` for sandbox testing |
| `RESEND_WEBHOOK_SECRET` | For webhooks | Signing secret (`whsec_…`) from your Resend webhook settings             |

## Resend setup

### Sending domain

- Sandbox/test mode (onboarding@resend.dev): you can only email your own Resend account address.
- To email anyone, verify a domain at resend.com/domains and set `FROM_EMAIL` to that domain. See more info [in the docs](https://resend.com/docs/dashboard/domains/introduction).

### Webhooks (optional)

1. In Resend, add a webhook pointing at `https://<your-deployment>/api/webhooks`
2. Subscribe to: `email.sent`, `email.delivered`, `email.bounced`, `email.complained`
3. Copy the signing secret into `RESEND_WEBHOOK_SECRET` and redeploy

## Project structure

```
app/
  page.tsx               # the ticket form (client component)
  api/send/route.ts      # generate ticket, send confirmation, schedule reminder
  api/webhooks/route.ts  # verify signature + log Resend events
emails/
  TicketConfirmation.tsx # confirmation email (notes the attached PDF)
  ShowReminder.tsx       # "your show is tomorrow" reminder
lib/
  resend.ts              # shared Resend client (lazy singleton)
  ticket-number.ts       # nanoid-based ticket number
  ticket-pdf.tsx         # PDF ticket (server-only)
  logo.ts                # base64 logo embedded in the PDF
  dates.ts               # timezone-safe formatting + reminder scheduling
  webhook-signature.ts   # Svix HMAC verification for the webhook route
  site-url.ts            # base URL for absolute email image links
  *.test.ts              # Vitest unit tests (dates, ticket-number, signature)
public/                  # logo assets
```

## Deployment

- Deploys to Vercel with zero config (auto-detected as Next.js)
- Set the env vars above in the Vercel project settings, then redeploy

## Tests

Run the tests with `npm test`.

## Working with AI

I built this app with Claude Code, and rather than leave that unsaid, here is how. Claude Code did most of the implementation typing. I directed the work, made engineering decisions, and reviewed every change before it was committed. I also used the [superpowers](https://github.com/obra/superpowers?tab=readme-ov-file) brainstorm skill to work through decisions before any code was written.

I reviewed rather than trusted. Used this way, AI handled the mechanical work quickly while the design, review, and accountability stayed with me. This is how I was coding at my previous job, and how I would expect to contribute to the code going forward, though I am happy to align on whatever AI norms the team prefers.
