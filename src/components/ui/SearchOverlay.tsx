"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/article";
import type { ApiResponse } from "@/types/api";

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

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setSearched(true);

      try {
        const res = await fetch(
          `/api/news?q=${encodeURIComponent(query.trim())}&pageSize=8`,
          { signal: abortRef.current.signal }
        );
        const json: ApiResponse<{ articles: Article[] }> = await res.json();
        if (json.success && json.data) {
          setArticles(json.data.articles);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        Search
        <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-block">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Search panel */}
      <div className="fixed inset-x-0 top-0 z-50 mx-auto mt-20 max-w-2xl px-4">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          {/* Search input */}
          <form onSubmit={handleSearch} className="flex items-center border-b border-gray-200">
            <svg
              className="ml-4 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mr-3 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-400 hover:text-gray-600"
            >
              Esc
            </button>
          </form>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              </div>
            ) : searched && articles.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : searched ? (
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
                      onClick={() => setOpen(false)}
                      className="flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {article.urlToImage ? (
                          <Image
                            src={article.urlToImage}
                            alt={article.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white/80">
                            {article.title
                              .split(" ")
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center gap-1">
                        <div className="text-xs text-gray-500">
                          {article.source.name} &middot;{" "}
                          {timeAgo(article.publishedAt)}
                        </div>
                        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-400">
                Type to search tech news...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
