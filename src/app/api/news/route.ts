import { NextRequest, NextResponse } from "next/server";
import { fetchTopHeadlines, fetchEverything } from "@/lib/newsapi";
import { getCached, setCache, CACHE_TTL } from "@/lib/cache";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/types/api";
import type { NewsResponse } from "@/types/article";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "20");
  const query = searchParams.get("q");

  logger.info("API /news called", { page, pageSize, query });

  const cacheKey = `news:${query || "headlines"}:${page}:${pageSize}`;
  const cached = getCached<NewsResponse>(cacheKey);
  if (cached) {
    logger.debug("Cache hit", { cacheKey });
    return NextResponse.json<ApiResponse<NewsResponse>>(
      {
        success: true,
        data: cached,
        timestamp: new Date().toISOString(),
      },
      { headers: CACHE_HEADERS }
    );
  }

  try {
    logger.info("Fetching news", { page, pageSize, query });

    const data = query
      ? await fetchEverything({ query, page, pageSize })
      : await fetchTopHeadlines({ page, pageSize });

    setCache(cacheKey, data, CACHE_TTL.headlines);

    return NextResponse.json<ApiResponse<NewsResponse>>(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    logger.error("Failed to fetch news", {
      error: error instanceof Error ? error.message : String(error),
      page,
      pageSize,
      query,
    });

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "NEWS_FETCH_ERROR",
          message: "Failed to fetch news. Please try again later.",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
