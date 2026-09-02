import { memo } from "react";
import type { Article } from "@/types/article";
import { ShareButton } from "@/components/ui/ShareButton";

function ArticleDetailInner({ article }: { article: Article }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {article.source.name}
          </span>
          {article.author && (
            <>
              <span>&middot;</span>
              <span>{article.author}</span>
            </>
          )}
          <span>&middot;</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          {article.title}
        </h1>
        {article.description && (
          <p className="mt-4 text-lg text-gray-600">{article.description}</p>
        )}
      </header>

      {article.urlToImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.urlToImage}
            alt={article.title}
            className="h-full w-full object-cover"
            width={1200}
            height={675}
          />
        </div>
      )}

      {article.content && (
        <div className="prose prose-gray max-w-none">
          <p className="whitespace-pre-line text-base leading-relaxed">
            {article.content}
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Read full article
          <span aria-hidden="true">&rarr;</span>
        </a>
        <ShareButton
          title={article.title}
          url={`${siteUrl}/article/${slug}`}
        />
      </div>
    </article>
  );
}

export const ArticleDetail = memo(ArticleDetailInner);
