"use client";

import { WebVitals } from "@/components/ui/WebVitals";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <WebVitals />
      {children}
    </ErrorBoundary>
  );
}
