"use client";

import { useEffect, useState, useCallback } from "react";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { ArticleGridSkeleton } from "@/components/ui/Skeleton";
import type { Article } from "@/types/article";
import type { ApiResponse } from "@/types/api";

export default function LivePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/news?pageSize=12");
      const json: ApiResponse<{ articles: Article[] }> = await res.json();
      if (json.success && json.data) {
        setArticles(json.data.articles);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch live feed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    const interval = setInterval(fetchArticles, 15000);
    return () => clearInterval(interval);
  }, [fetchArticles]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Feed</h1>
          <p className="mt-1 text-sm text-gray-500">
            Auto-refreshes every 15 seconds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="text-xs text-gray-500">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Loading..."}
          </span>
        </div>
      </div>

      {loading ? (
        <ArticleGridSkeleton count={6} />
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </div>
  );
}
