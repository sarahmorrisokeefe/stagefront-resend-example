"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const fields = [
  { name: "fanName", label: "Your name", type: "text", placeholder: "Jane Fan" },
  { name: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
  { name: "showName", label: "Show", type: "text", placeholder: "Midnight Set at The Echo" },
  { name: "venue", label: "Venue", type: "text", placeholder: "The Echo, Los Angeles" },
  { name: "date", label: "Show date", type: "date", placeholder: "" },
] as const;

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setTicketNumber(data.ticketNumber);
      setStatus("success");
      form.reset();
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <header className="mb-10">
        <p className="text-xs tracking-[0.3em] text-accent">STAGEFRONT</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">
          Claim your ticket.
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Drop your details and we&apos;ll send the confirmation — PDF ticket
          attached — straight to your inbox.
        </p>
      </header>

      {status === "success" ? (
        <div className="border border-white/10 p-8 text-center">
          <p className="text-xs tracking-[0.3em] text-accent">CONFIRMED</p>
          <p className="mt-4 text-xl font-medium">
            You&apos;re on the list. Check your inbox.
          </p>
          <p className="mt-3 font-mono text-sm text-white/50">
            {ticketNumber}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-8 text-xs tracking-wide text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
          >
            Claim another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 block text-xs tracking-wide text-white/50">
                {field.label}
              </span>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required
                disabled={status === "loading"}
                className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent disabled:opacity-50"
              />
            </label>
          ))}

          {status === "error" && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-accent px-4 py-3 text-sm font-semibold tracking-wide text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Get my ticket"}
          </button>
        </form>
      )}

      <footer className="mt-12 text-center text-[11px] tracking-wide text-white/25">
        Powered by Resend
      </footer>
    </main>
  );
}
