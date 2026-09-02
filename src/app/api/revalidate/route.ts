import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { secret } = body as { secret?: string };

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid revalidation secret.",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  try {
    revalidateTag("news", "max");
    logger.info("Cleared news cache via revalidateTag");

    return NextResponse.json<ApiResponse<{ revalidated: boolean }>>({
      success: true,
      data: { revalidated: true },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Revalidation failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "REVALIDATION_ERROR",
          message: "Failed to revalidate.",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
