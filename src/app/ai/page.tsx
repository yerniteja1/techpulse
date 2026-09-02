import { fetchTopHeadlines } from "@/lib/newsapi";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import type { Metadata } from "next";
import type { Article } from "@/types/article";

export const metadata: Metadata = {
  title: "AI & Machine Learning",
  description: "Artificial intelligence, machine learning, and deep learning news",
};

export default async function AIPage() {
  let articles: Article[] = [];
  try {
    const data = await fetchTopHeadlines({ category: "artificial-intelligence", pageSize: 12 });
    articles = data.articles;
  } catch {
    articles = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Artificial Intelligence</h1>
        <p className="mt-1 text-sm text-gray-500">
          AI, machine learning, and the future of intelligence
        </p>
      </div>
      <ArticleGrid articles={articles} />
    </div>
  );
}
