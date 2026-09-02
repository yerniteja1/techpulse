import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Providers } from "@/components/layout/Providers";
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
  title: {
    default: "TechPulse — Tech News",
    template: "%s | TechPulse",
  },
  description: "Latest technology, AI, startup, and cybersecurity news",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tech", label: "Tech" },
  { href: "/ai", label: "AI" },
  { href: "/startups", label: "Startups" },
  { href: "/cybersecurity", label: "Cybersecurity" },
  { href: "/live", label: "Live" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Providers>
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="text-lg font-bold tracking-tight">
                TechPulse
              </Link>
              <nav className="hidden gap-1 sm:flex">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/search"
                className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Search
              </Link>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 text-xs text-gray-500">
              <span>TechPulse &copy; {new Date().getFullYear()}</span>
              <span>Built with Next.js</span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
