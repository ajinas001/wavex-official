import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/obsidian/PageTransition";
import Cursor from "@/components/obsidian/Cursor";
import Header from "@/components/obsidian/Header";
import AdmissionForm from "@/components/obsidian/AdmissionForm";
import Wordmark from "@/components/obsidian/sections/Wordmark";
import SmoothScroll from "@/lib/SmoothScroll";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wavex.studio"),
  title: {
    default: "WaveX — A Private Assembly for Makers",
    template: "%s — WaveX",
  },
  description:
    "WaveX is a private assembly for makers — places, objects and admission in equal measure.",
  keywords: [
    "web design studio",
    "creative studio",
    "interactive design",
    "Next.js development",
    "motion design",
  ],
  openGraph: {
    title: "WaveX — A Private Assembly for Makers",
    description:
      "Places, objects and admission. Work happens slowly, on purpose.",
    url: "https://wavex.studio",
    siteName: "WaveX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WaveX — A Private Assembly for Makers",
    description: "Places, objects and admission.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={mono.variable}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black font-body text-yellow antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-yellow focus:px-6 focus:py-3 focus:text-black focus:font-body"
        >
          Skip to content
        </a>
        <PageTransition />
        <Cursor />
        <Header />
        <main id="main-content">
          <SmoothScroll>{children}</SmoothScroll>
        </main>
        <AdmissionForm />
        <Wordmark />
      </body>
    </html>
  );
}
