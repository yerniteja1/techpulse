import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/news/ArticleDetail";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/ui/StructuredData";
import { logger } from "@/lib/logger";
import type { Metadata } from "next";
import type { Article } from "@/types/article";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ d?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { d } = await searchParams;

  if (d) {
    try {
      const data = JSON.parse(Buffer.from(decodeURIComponent(d), "base64").toString());
      return { title: data.t };
    } catch {}
  }

  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { d } = await searchParams;

  let article: Article | null = null;

  if (d) {
    try {
      const data = JSON.parse(Buffer.from(decodeURIComponent(d), "base64").toString());
      article = {
        source: { name: data.s || "Unknown" },
        title: data.t,
        description: data.d || null,
        content: data.c || null,
        url: data.u,
        image: data.i || null,
        publishedAt: data.p,
      };
      logger.info("Article page: loaded from URL data", { slug });
    } catch (error) {
      logger.error("Article page: failed to decode URL data", {
        slug,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (!article) {
    logger.warn("Article page: no data found", { slug });
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <ArticleJsonLd
        title={article!.title}
        description={article!.description || undefined}
        image={article!.image || undefined}
        datePublished={article!.publishedAt}
        url={`${siteUrl}/article/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Article", url: `${siteUrl}/article/${slug}` },
        ]}
      />
      <ArticleDetail article={article!} />
    </>
  );
}
