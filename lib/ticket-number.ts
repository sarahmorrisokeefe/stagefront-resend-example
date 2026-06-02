import { customAlphabet } from "nanoid";

// Crockford-ish alphabet: uppercase + digits, no ambiguous 0/O/1/I.
const nanoid = customAlphabet("ABCDEFGHJKMNPQRSTUVWXYZ23456789", 8);

/**
 * Returns a human-readable ticket number like "SF-7K3MQ9XZ".
 * Stateless — uniqueness is probabilistic, which is fine for a stateless demo.
 */
export function generateTicketNumber(): string {
  return `SF-${nanoid()}`;
}
