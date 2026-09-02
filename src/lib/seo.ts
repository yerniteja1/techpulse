import type { Metadata } from "next";
import type { Article } from "@/types/article";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = "TechPulse";

export function generateSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} — Tech News`,
      template: `%s | ${SITE_NAME}`,
    },
    description: "Latest technology, AI, startup, and cybersecurity news",
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
    },
  };
}

export function generateArticleMetadata(article: Article): Metadata {
  return {
    title: article.title,
    description: article.description || article.title,
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.urlToImage ? [{ url: article.urlToImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || undefined,
      images: article.urlToImage ? [article.urlToImage] : [],
    },
  };
}

export function generateArticleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.urlToImage,
    datePublished: article.publishedAt,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
