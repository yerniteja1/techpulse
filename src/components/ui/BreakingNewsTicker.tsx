"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/types/article";

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

export function BreakingNewsTicker({ articles }: { articles: Article[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (articles.length === 0) return;
    const timer = setInterval(() => {
      setOffset((prev) => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [articles.length]);

  if (articles.length === 0) return null;

  return (
    <div className="overflow-hidden border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-9 max-w-6xl items-center gap-3 px-4">
        <span className="shrink-0 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex gap-12 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${offset * 100}%)` }}
          >
            {articles.map((article, i) => (
              <div
                key={`${article.url}-${i}`}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                >
                  {article.title.length > 80
                    ? `${article.title.slice(0, 80)}...`
                    : article.title}
                </a>
                <span className="text-gray-400">&middot;</span>
                <span className="text-gray-500">{article.source.name}</span>
                <span className="text-gray-400">&middot;</span>
                <span className="text-gray-400">
                  {timeAgo(article.publishedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
