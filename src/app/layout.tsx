// src/app/layout.tsx
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
  title: "API Trust Score",
  description:
    "Daily checks rank latency, uptime & cost—rolled into one Trust Score before you integrate.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#94A88C] text-neutral-50`}
      >
        {children}
      </body>
    </html>
  );
}