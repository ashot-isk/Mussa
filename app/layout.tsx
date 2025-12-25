import "./globals.css";
import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";

const jost = Jost({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "mussa Floral Studio",
  description: "Flowers that speak for you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
