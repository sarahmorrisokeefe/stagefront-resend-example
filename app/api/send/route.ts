import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { generateTicketNumber } from '@/lib/ticket-number';
import { formatShowDate, reminderTimeFor } from '@/lib/dates';
import { renderTicketPdf } from '@/lib/ticket-pdf';
import TicketConfirmation from '@/emails/TicketConfirmation';
import ShowReminder from '@/emails/ShowReminder';

// @react-pdf/renderer needs the Node runtime — it won't run on the edge.
export const runtime = 'nodejs';

interface SendBody {
  fanName?: string;
  email?: string;
  showName?: string;
  venue?: string;
  date?: string; // "YYYY-MM-DD"
}

export async function POST(request: Request) {
  let body: SendBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const fanName = body.fanName?.trim();
  const email = body.email?.trim();
  const showName = body.showName?.trim();
  const venue = body.venue?.trim();
  const date = body.date?.trim();

  if (!fanName || !email || !showName || !venue || !date) {
    return NextResponse.json(
      { error: 'All fields are required.' },
      { status: 400 },
    );
  }

  const from = process.env.FROM_EMAIL;
  if (!from) {
    return NextResponse.json(
      { error: 'FROM_EMAIL is not configured.' },
      { status: 500 },
    );
  }

  const ticketNumber = generateTicketNumber();
  const displayDate = formatShowDate(date);

  // Stable idempotency seed so retries of the same submission don't re-send.
  const seed = Buffer.from(`${email}-${showName}-${date}`).toString('base64');

  try {
    const pdf = await renderTicketPdf({
      showName,
      fanName,
      venue,
      date: displayDate,
      ticketNumber,
    });

    // 1. Confirmation email with the PDF ticket attached.
    const { error: confirmError } = await resend.emails.send(
      {
        from,
        to: email,
        subject: `You're on the list — ${showName}`,
        react: TicketConfirmation({
          fanName,
          showName,
          venue,
          date: displayDate,
          ticketNumber,
        }),
        // No inlineContentId → sent as a real Content-Disposition: attachment,
        // not embedded in the body. contentType set explicitly so every client
        // treats it as a downloadable PDF rather than inferring from the name.
        attachments: [
          {
            filename: 'ticket.pdf',
            content: pdf,
            contentType: 'application/pdf',
          },
        ],
      },
      { idempotencyKey: `ticket-confirm-${seed}` },
    );

    if (confirmError) {
      console.error('Confirmation send failed:', confirmError);

      const err = confirmError as {
        name?: string;
        statusCode?: number;
        message?: string;
      };

      // The idempotency key (email + show + date) already went out, but with
      // a different body — i.e. this is a duplicate claim, not a clean retry.
      if (err.name === 'invalid_idempotent_request' || err.statusCode === 409) {
        return NextResponse.json(
          {
            error:
              "Looks like you've already claimed a ticket for this show with this email. Check your inbox — your original confirmation is already there.",
          },
          { status: 409 },
        );
      }

      // Test mode: with no verified domain, Resend only delivers to your own
      // account email. Surface Resend's actionable message rather than a vague
      // "try again" — retrying won't help until a domain is verified.
      if (err.statusCode === 403) {
        return NextResponse.json(
          {
            error:
              err.message ??
              'This sender can only deliver to your own Resend account email until you verify a domain.',
          },
          { status: 403 },
        );
      }

      // Resend rejected the address itself (e.g. malformed).
      if (err.statusCode === 422) {
        return NextResponse.json(
          { error: 'That email address was rejected. Double-check it.' },
          { status: 422 },
        );
      }

      return NextResponse.json(
        { error: 'Could not send your confirmation. Try again.' },
        { status: 502 },
      );
    }

    // 2. Reminder email, scheduled for 8pm the night before the show.
    const scheduledAt = reminderTimeFor(date);
    if (scheduledAt) {
      const { error: remindError } = await resend.emails.send(
        {
          from,
          to: email,
          subject: `${showName} is tomorrow`,
          react: ShowReminder({ fanName, showName, venue }),
          scheduledAt,
        },
        { idempotencyKey: `ticket-remind-${seed}` },
      );

      // A failed reminder shouldn't fail the whole request — the ticket is
      // already out the door. Log it and move on.
      if (remindError) {
        console.error('Reminder schedule failed:', remindError);
      }
    }

    return NextResponse.json({ ok: true, ticketNumber });
  } catch (err) {
    console.error('Unexpected error in /api/send:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end.' },
      { status: 500 },
    );
  }
}
