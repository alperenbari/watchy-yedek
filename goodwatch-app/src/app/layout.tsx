import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goodwatch Studio",
  description:
    "A Next.js starter that recreates the Goodwatch discovery experience with TMDB and JustWatch integrations.",
  metadataBase: new URL("https://goodwatch.app"),
  openGraph: {
    title: "Goodwatch Studio",
    description:
      "Discover the best films and series with live availability, critics consensus, and smart filters.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodwatch Studio",
    description:
      "Track premieres and streaming availability with a cinematic Next.js experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
