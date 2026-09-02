import { fetchTopHeadlines } from "@/lib/newsapi";
import { BreakingNewsTicker } from "@/components/ui/BreakingNewsTicker";
import type { Article } from "@/types/article";

export async function BreakingNews() {
  let articles: Article[] = [];
  try {
    const data = await fetchTopHeadlines({ pageSize: 5 });
    articles = data.articles.slice(0, 5);
  } catch {
    articles = [];
  }

  if (articles.length === 0) return null;

  return <BreakingNewsTicker articles={articles} />;
}
