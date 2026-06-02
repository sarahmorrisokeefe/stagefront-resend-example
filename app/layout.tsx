import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stagefront",
  description: "Indie show ticket confirmations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
