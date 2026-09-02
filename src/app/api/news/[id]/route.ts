import { NextRequest, NextResponse } from "next/server";
import { fetchEverything } from "@/lib/newsapi";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/types/api";
import type { Article } from "@/types/article";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  try {
    logger.info("Fetching article", { id: decodedId });

    const result = await fetchEverything({
      query: decodedId,
      pageSize: 1,
    });

    const article = result.articles[0] ?? null;

    if (!article) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "ARTICLE_NOT_FOUND",
            message: "Article not found.",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Article>>({
      success: true,
      data: article,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to fetch article", {
      id: decodedId,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "ARTICLE_FETCH_ERROR",
          message: "Failed to fetch article.",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
