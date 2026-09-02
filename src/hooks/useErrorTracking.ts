"use client";

import { useCallback, useEffect } from "react";
import { logger } from "@/lib/logger";

interface ClientError {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  timestamp: number;
}

export function useErrorTracking() {
  const reportError = useCallback(
    (error: Error, componentStack?: string) => {
      const clientError: ClientError = {
        message: error.message,
        stack: error.stack,
        componentStack,
        url: window.location.href,
        timestamp: Date.now(),
      };

      logger.error("Client error", {
        message: clientError.message,
        url: clientError.url,
        timestamp: clientError.timestamp,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/errors",
          JSON.stringify(clientError)
        );
      }
    },
    []
  );

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(
        new Error(
          typeof event.reason === "string"
            ? event.reason
            : "Unhandled promise rejection"
        )
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [reportError]);

  return { reportError };
}
