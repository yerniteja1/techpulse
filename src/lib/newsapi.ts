import { z } from "zod";
import {
  NewsResponseSchema,
  type NewsResponse,
  type Category,
  type Article,
} from "@/types/article";

const NEWS_API_BASE = "https://newsapi.org/v2";

const API_KEY = process.env.NEWS_API_KEY;

if (!API_KEY) {
  throw new Error("NEWS_API_KEY environment variable is required");
}

const CATEGORY_QUERIES: Record<Category, string> = {
  technology: "technology",
  "artificial-intelligence": "artificial intelligence OR AI OR machine learning",
  startups: "startups OR venture capital OR funding",
  cybersecurity: "cybersecurity OR data breach OR hacking",
};

function buildUrl(
  endpoint: "top-headlines" | "everything",
  params: Record<string, string>
): string {
  const url = new URL(`${NEWS_API_BASE}/${endpoint}`);
  url.searchParams.set("apiKey", API_KEY!);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function validateResponse(data: unknown): NewsResponse {
  const result = NewsResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("[NewsAPI] Validation error:", result.error.flatten());
    throw new Error("Invalid response from NewsAPI");
  }
  return result.data;
}

export async function fetchTopHeadlines(options: {
  page?: number;
  pageSize?: number;
  country?: string;
}): Promise<NewsResponse> {
  const { page = 1, pageSize = 20, country = "us" } = options;

  const params: Record<string, string> = {
    country,
    page: String(page),
    pageSize: String(pageSize),
  };

  const url = buildUrl("top-headlines", params);
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[NewsAPI] HTTP ${res.status}:`, text);
    throw new Error(`NewsAPI request failed: ${res.status}`);
  }

  const data = await res.json();
  return validateResponse(data);
}

export async function fetchByCategory(options: {
  category: Category;
  page?: number;
  pageSize?: number;
}): Promise<NewsResponse> {
  const { category, page = 1, pageSize = 20 } = options;

  return fetchEverything({
    query: CATEGORY_QUERIES[category],
    page,
    pageSize,
  });
}

export async function fetchEverything(options: {
  query: string;
  page?: number;
  pageSize?: number;
  sortBy?: "relevancy" | "popularity" | "publishedAt";
}): Promise<NewsResponse> {
  const { query, page = 1, pageSize = 20, sortBy = "publishedAt" } = options;

  const params: Record<string, string> = {
    q: query,
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    language: "en",
  };

  const url = buildUrl("everything", params);
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[NewsAPI] HTTP ${res.status}:`, text);
    throw new Error(`NewsAPI request failed: ${res.status}`);
  }

  const data = await res.json();
  return validateResponse(data);
}

export async function fetchArticleById(articleId: string): Promise<Article | null> {
  const result = await fetchEverything({
    query: articleId,
    pageSize: 1,
  });
  return result.articles[0] ?? null;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);
}
