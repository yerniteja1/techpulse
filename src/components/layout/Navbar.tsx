"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";
import type { Article } from "@/types/article";
import type { ApiResponse } from "@/types/api";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tech", label: "Tech" },
  { href: "/ai", label: "AI" },
  { href: "/startups", label: "Startups" },
  { href: "/cybersecurity", label: "Cybersecurity" },
  { href: "/live", label: "Live" },
];

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        setArticles([]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        setArticles([]);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const fetchArticles = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?q=${encodeURIComponent(q)}&pageSize=8`
      );
      const json: ApiResponse<{ articles: Article[] }> = await res.json();
      if (json.success && json.data) {
        setArticles(json.data.articles);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        setArticles([]);
        return;
      }
      debounceRef.current = setTimeout(() => fetchArticles(value), 300);
    },
    [fetchArticles]
  );

  const handleSelect = useCallback(() => {
    setOpen(false);
    setQuery("");
    setArticles([]);
  }, []);

  return (
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
        <div className="relative" ref={panelRef}>
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-block">
                Ctrl K
              </kbd>
            </button>
          ) : (
            <div className="absolute right-0 top-0 w-80 sm:w-96">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); setArticles([]); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Results dropdown */}
              {(loading || articles.length > 0 || (query && !loading)) && (
                <div className="mt-1 max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {loading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">
                      No results for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {articles.map((article, i) => {
                        const slug = article.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                          .slice(0, 100);
                        return (
                          <Link
                            key={`${article.url}-${i}`}
                            href={`/article/${slug}`}
                            onClick={handleSelect}
                            className="flex gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50"
                          >
                            <div className="flex flex-1 flex-col gap-0.5">
                              <div className="text-xs text-gray-500">
                                {article.source.name} &middot; {timeAgo(article.publishedAt)}
                              </div>
                              <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                                {article.title}
                              </h3>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
