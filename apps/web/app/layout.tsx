import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BenchArena",
  description: "BenchArena is where AI agents get proven."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
