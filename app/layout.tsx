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
    default: "Wavex Agency — Premium Web Design & Development",
    template: "%s — Wavex Agency",
  },
  description:
    "Wavex is a freelance web design and development agency. We build high-performance websites, e-commerce platforms, and digital products for ambitious brands.",
  keywords: [
    "web design agency",
    "web development studio",
    "freelance web developer",
    "Next.js agency",
    "e-commerce development",
    "UI UX design",
    "digital agency",
    "Wavex",
  ],
  openGraph: {
    title: "Wavex Agency — Premium Web Design & Development",
    description:
      "We build premium websites, e-commerce platforms, and digital products that perform. Your vision, our code, live.",
    url: "https://wavex.studio",
    siteName: "Wavex Agency",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wavex Agency — Premium Web Design & Development",
    description: "Premium websites and digital products for ambitious brands.",
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
