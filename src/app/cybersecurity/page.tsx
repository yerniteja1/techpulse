import { fetchByCategory } from "@/lib/newsapi";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import type { Metadata } from "next";
import type { Article } from "@/types/article";

export const metadata: Metadata = {
  title: "Cybersecurity",
  description: "Cybersecurity news, data breaches, and threat intelligence",
};

export default async function CybersecurityPage() {
  let articles: Article[] = [];
  try {
    const data = await fetchByCategory({ category: "cybersecurity", pageSize: 12 });
    articles = data.articles;
  } catch {
    articles = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Cybersecurity</h1>
        <p className="mt-1 text-sm text-gray-500">
          Threats, vulnerabilities, and security best practices
        </p>
      </div>
      <ArticleGrid articles={articles} />
    </div>
  );
}
