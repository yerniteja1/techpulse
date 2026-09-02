"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import type { Article } from "@/types/article";
import type { ApiResponse } from "@/types/api";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      setLoading(true);
      setSearched(true);

      try {
        const res = await fetch(
          `/api/news?q=${encodeURIComponent(query.trim())}&pageSize=12`
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
    },
    [query]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search technology news from around the web
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          Searching...
        </div>
      ) : searched && articles.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          No results found for &ldquo;{query}&rdquo;
        </div>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </div>
  );
}
