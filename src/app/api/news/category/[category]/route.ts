import { NextRequest, NextResponse } from "next/server";
import { fetchByCategory } from "@/lib/newsapi";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/types/api";
import type { NewsResponse, Category } from "@/types/article";

const VALID_CATEGORIES: Category[] = [
  "technology",
  "artificial-intelligence",
  "startups",
  "cybersecurity",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category: rawCategory } = await params;
  const category = rawCategory as Category;

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INVALID_CATEGORY",
          message: `Valid categories: ${VALID_CATEGORIES.join(", ")}`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "20");

  try {
    logger.info("Fetching category news", { category, page, pageSize });

    const data = await fetchByCategory({ category, page, pageSize });

    return NextResponse.json<ApiResponse<NewsResponse>>({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to fetch category news", {
      category,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "CATEGORY_FETCH_ERROR",
          message: `Failed to fetch ${category} news.`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
