import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const krypton = localFont({
  src: [
    { path: "./fonts/MonaspaceKrypton-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/MonaspaceKrypton-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-krypton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arlek — websites & automations for Canadian small businesses",
  description:
    "Arlek is a one-person studio in Ottawa building modern websites and quiet automations for Canadian small businesses.",
  openGraph: {
    title: "Arlek — websites & automations for Canadian small businesses",
    description:
      "Arlek is a one-person studio in Ottawa building modern websites and quiet automations for Canadian small businesses.",
    type: "website",
    url: "https://arlek.ca",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${krypton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
