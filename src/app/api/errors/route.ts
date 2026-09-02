import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, stack, componentStack, url, timestamp } = body;

    logger.error("Client error reported", {
      message,
      stack: stack?.slice(0, 500),
      componentStack: componentStack?.slice(0, 500),
      url,
      timestamp,
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to log client error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
