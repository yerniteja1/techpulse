"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { ArticleGridSkeleton } from "@/components/ui/Skeleton";
import type { Article } from "@/types/article";
import type { ApiResponse } from "@/types/api";

export function SearchFilter({ initialArticles }: { initialArticles: Article[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [showingSearch, setShowingSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
        setArticles(initialArticles);
        setShowingSearch(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, initialArticles]);

  const fetchArticles = useCallback(async (q: string) => {
    setLoading(true);
    setShowingSearch(true);
    try {
      const res = await fetch(
        `/api/news?q=${encodeURIComponent(q)}&pageSize=12`
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

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        setArticles(initialArticles);
        setShowingSearch(false);
        return;
      }
      debounceRef.current = setTimeout(() => fetchArticles(value), 300);
    },
    [fetchArticles, initialArticles]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setArticles(initialArticles);
    setShowingSearch(false);
    inputRef.current?.focus();
  }, [initialArticles]);

  return (
    <>
      {/* Search toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Search
          <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-block">
            Ctrl K
          </kbd>
        </button>
      )}

      {/* Search input */}
      {open && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Filter articles..."
              className="w-64 rounded-lg border border-gray-200 bg-white py-1.5 pl-10 pr-8 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 lg:w-80"
            />
            {query && (
              <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => { setOpen(false); handleClear(); }}
            className="rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            Esc
          </button>
        </div>
      )}

      {/* Search results or initial articles */}
      <div className="w-full">
        {showingSearch && (
          <div className="mb-4 mt-6 text-sm text-gray-500">
            {loading ? "Searching..." : `${articles.length} results for "${query}"`}
          </div>
        )}
        {loading ? (
          <ArticleGridSkeleton count={6} />
        ) : articles.length === 0 && showingSearch ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            No articles found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <ArticleGrid articles={articles} />
        )}
      </div>
    </>
  );
}
