import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, rating, delta, id, navigationType, timestamp } = body;

    logger.info("Web Vital", {
      metric: name,
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      id,
      navigationType,
      timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to log web vital", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
