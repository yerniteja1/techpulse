import { notFound } from "next/navigation";
import { fetchEverything } from "@/lib/newsapi";
import { ArticleDetail } from "@/components/news/ArticleDetail";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/ui/StructuredData";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { title };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    const result = await fetchEverything({ query: slug, pageSize: 1 });
    article = result.articles[0] ?? null;
  } catch {
    article = null;
  }

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.description || undefined}
        image={article.urlToImage || undefined}
        datePublished={article.publishedAt}
        author={article.author || undefined}
        url={`${siteUrl}/article/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteUrl },
          { name: "Article", url: `${siteUrl}/article/${slug}` },
        ]}
      />
      <ArticleDetail article={article} />
    </>
  );
}
