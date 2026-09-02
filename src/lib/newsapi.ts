import {
  GNewsResponseSchema,
  type NewsResponse,
  type Category,
  type Article,
} from "@/types/article";

const GNEWS_API_BASE = "https://gnews.io/api/v4";

const API_KEY = process.env.GNEWS_API_KEY;

if (!API_KEY) {
  throw new Error("GNEWS_API_KEY environment variable is required");
}

const CATEGORY_MAP: Record<Category, string> = {
  technology: "technology",
  "artificial-intelligence": "artificial intelligence",
  startups: "startups",
  cybersecurity: "cybersecurity",
};

function buildUrl(
  endpoint: "top-headlines" | "search",
  params: Record<string, string>
): string {
  const url = new URL(`${GNEWS_API_BASE}/${endpoint}`);
  url.searchParams.set("apikey", API_KEY!);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function mapToNewsResponse(data: unknown): NewsResponse {
  const result = GNewsResponseSchema.safeParse(data);
  if (!result.success) {
    console.error("[GNews] Validation error:", result.error.flatten());
    throw new Error("Invalid response from GNews API");
  }
  return {
    totalResults: result.data.totalArticles,
    articles: result.data.articles,
  };
}

export async function fetchTopHeadlines(options: {
  page?: number;
  pageSize?: number;
  country?: string;
}): Promise<NewsResponse> {
  const { pageSize = 20 } = options;

  const params: Record<string, string> = {
    category: "technology",
    max: String(pageSize),
  };

  const url = buildUrl("top-headlines", params);
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GNews] HTTP ${res.status}:`, text);
    throw new Error(`GNews request failed: ${res.status}`);
  }

  const data = await res.json();
  return mapToNewsResponse(data);
}

export async function fetchByCategory(options: {
  category: Category;
  page?: number;
  pageSize?: number;
}): Promise<NewsResponse> {
  const { category, pageSize = 20 } = options;

  const params: Record<string, string> = {
    q: CATEGORY_MAP[category],
    max: String(pageSize),
  };

  const url = buildUrl("search", params);
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GNews] HTTP ${res.status}:`, text);
    throw new Error(`GNews request failed: ${res.status}`);
  }

  const data = await res.json();
  return mapToNewsResponse(data);
}

export async function fetchEverything(options: {
  query: string;
  page?: number;
  pageSize?: number;
  sortBy?: "relevancy" | "popularity" | "publishedAt";
}): Promise<NewsResponse> {
  const { query, pageSize = 20 } = options;

  const params: Record<string, string> = {
    q: query,
    max: String(pageSize),
  };

  const url = buildUrl("search", params);
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GNews] HTTP ${res.status}:`, text);
    throw new Error(`GNews request failed: ${res.status}`);
  }

  const data = await res.json();
  return mapToNewsResponse(data);
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
