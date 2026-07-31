import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/lib/SmoothScroll";
import Cursor from "@/components/Cursor";

// Display face: a high-contrast geometric grotesque standing in for
// PP Neue Montreal / General Sans, which are licensed foundry fonts.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studio-noir.example"),
  title: {
    default: "Studio Noir — Independent Web Design & Development Studio",
    template: "%s — Studio Noir",
  },
  description:
    "Studio Noir is an independent design and development practice building cinematic, high-performance websites for ambitious brands.",
  keywords: [
    "web design studio",
    "freelance web developer",
    "creative agency",
    "interactive design",
    "Next.js development",
  ],
  openGraph: {
    title: "Studio Noir — Independent Web Design & Development Studio",
    description:
      "Cinematic, high-performance websites for ambitious brands. Design, motion and code under one roof.",
    url: "https://studio-noir.example",
    siteName: "Studio Noir",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Noir — Independent Web Design & Development Studio",
    description:
      "Cinematic, high-performance websites for ambitious brands.",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:text-bg"
        >
          Skip to content
        </a>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
