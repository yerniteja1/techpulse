"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

function sendMetric(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/vitals", body);
  } else {
    fetch("/api/vitals", {
      body,
      method: "POST",
      keepalive: true,
    });
  }
}

export function WebVitals() {
  useEffect(() => {
    onCLS(sendMetric);
    onINP(sendMetric);
    onLCP(sendMetric);
  }, []);

  return null;
}
