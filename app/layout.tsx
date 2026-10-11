import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ToastContainer from "@/components/ToastContainer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tokyo-updates.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tokyo_Updates — Discover Movies, Series & Where to Watch",
    template: "%s | Tokyo_Updates"
  },
  description: "Discover trending movies and series, ratings, cast details, trailers, reviews and official streaming options.",
  applicationName: "Tokyo_Updates",
  keywords: ["movies", "TV series", "TMDB", "movie discovery", "Tokyo Updates", "streaming guide"],
  authors: [{ name: "Tokyo_Updates" }],
  creator: "Tokyo_Updates",
  openGraph: {
    type: "website",
    siteName: "Tokyo_Updates",
    title: "Tokyo_Updates — Movie Discovery",
    description: "Trending movies, series, reviews and official streaming options.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Tokyo_Updates movie discovery" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tokyo_Updates — Movie Discovery",
    description: "Find movies, series, ratings, trailers and official streaming options.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg"
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#ff2e88",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        <main id="main-content" className="mx-auto min-h-[65vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <ToastContainer />
      </body>
    </html>
  );
}
