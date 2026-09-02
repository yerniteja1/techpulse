import { fetchTopHeadlines } from "@/lib/newsapi";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { BreakingNews } from "@/components/news/BreakingNews";
import { CategoryPill } from "@/components/ui/CategoryPill";
import { WebsiteJsonLd } from "@/components/ui/StructuredData";
import type { Metadata } from "next";
import type { Article } from "@/types/article";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TechPulse — Latest Tech News",
  description: "Stay up to date with the latest technology news",
};

const CATEGORIES = [
  "technology",
  "artificial-intelligence",
  "startups",
  "cybersecurity",
];

export default async function HomePage() {
  let articles: Article[] = [];
  try {
    const data = await fetchTopHeadlines({ pageSize: 12 });
    articles = data.articles;
  } catch {
    articles = [];
  }

  return (
    <>
      <WebsiteJsonLd />
      <BreakingNews />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Top Stories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Latest technology news from around the web
          </p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <CategoryPill key={cat} category={cat} />
          ))}
        </div>
        <ArticleGrid articles={articles} />
      </div>
    </>
  );
}
