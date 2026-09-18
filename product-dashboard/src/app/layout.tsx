import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-app.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Production Control Dashboard",
  description:
    "Internal dashboard for tracking work orders, machine assignments, and due dates.",
  applicationName: "Production Control Dashboard",
  keywords: [
    "production dashboard",
    "work orders",
    "machine schedule",
    "due dates",
    "operations tracking",
  ],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Production Control Dashboard",
    title: "Production Control Dashboard",
    description:
      "Internal dashboard for tracking work orders, machine assignments, and due dates.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Production Control Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Production Control Dashboard",
    description:
      "Internal dashboard for tracking work orders, machine assignments, and due dates.",
    images: ["/og.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans`}>
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
