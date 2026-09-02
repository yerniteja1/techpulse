import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1 },
    { url: `${SITE_URL}/tech`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${SITE_URL}/ai`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${SITE_URL}/startups`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${SITE_URL}/cybersecurity`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${SITE_URL}/live`, lastModified: new Date(), changeFrequency: "always" as const, priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  return staticPages;
}
