import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
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

function readTime(content: string | null): string {
  if (!content) return "1 min read";
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function isNewArticle(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 30 * 60 * 1000; // less than 30 minutes
}

function ArticleCardInner({
  article,
  priority = false,
}: {
  article: Article;
  priority?: boolean;
}) {
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);

  const isNew = isNewArticle(article.publishedAt);

  return (
    <Link
      href={`/article/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video w-full bg-gray-100">
        {article.urlToImage ? (
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
        {isNew && (
          <span className="absolute left-2 top-2 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
            New
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">
            {article.source.name}
          </span>
          <span>&middot;</span>
          <time dateTime={article.publishedAt}>
            {timeAgo(article.publishedAt)}
          </time>
          <span>&middot;</span>
          <span>{readTime(article.content)}</span>
        </div>
        <h2 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-blue-600">
          {article.title}
        </h2>
        {article.description && (
          <p className="line-clamp-2 text-sm text-gray-500">
            {article.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export const ArticleCard = memo(ArticleCardInner);
