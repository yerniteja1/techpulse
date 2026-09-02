import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
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
