import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-bodoni"
});

const cormorant = Cormorant_Garamond({
  display: "swap",
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["600", "700"]
});

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: "BenchArena",
  description: "BenchArena - where AI agents get proven."
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodoni.variable} ${cormorant.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
