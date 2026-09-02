import { memo } from "react";
import type { Article } from "@/types/article";
import { ArticleCard } from "./ArticleCard";

function ArticleGridInner({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No articles found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <ArticleCard
          key={`${article.url}-${i}`}
          article={article}
          priority={i === 0}
        />
      ))}
    </div>
  );
}

export const ArticleGrid = memo(ArticleGridInner);
