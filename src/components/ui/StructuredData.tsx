export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  author,
  url,
}: {
  title: string;
  description?: string;
  image?: string;
  datePublished: string;
  author?: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    image,
    datePublished,
    author: author ? { "@type": "Person", name: author } : undefined,
    publisher: {
      "@type": "Organization",
      name: "TechPulse",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TechPulse",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
