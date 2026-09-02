"use client";

import { useState, useCallback } from "react";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { ArticleGridSkeleton } from "@/components/ui/Skeleton";
import { SearchBar } from "@/components/ui/SearchBar";
import type { Article } from "@/types/article";

export function HomeContent({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleResults = useCallback((results: Article[]) => {
    setArticles(results);
    setLoading(false);
  }, []);

  const handleClear = useCallback(() => {
    setArticles(initialArticles);
    setSearchQuery("");
  }, [initialArticles]);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        <SearchBar onResults={handleResults} onClear={handleClear} />
      </div>

      {loading ? (
        <ArticleGridSkeleton count={6} />
      ) : (
        <>
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-500">
              {articles.length} results for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
          <ArticleGrid articles={articles} />
        </>
      )}
    </>
  );
}
