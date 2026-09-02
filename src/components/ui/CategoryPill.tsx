import Link from "next/link";

const CATEGORY_STYLES: Record<string, string> = {
  technology: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "artificial-intelligence": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  startups: "bg-green-100 text-green-800 hover:bg-green-200",
  cybersecurity: "bg-red-100 text-red-800 hover:bg-red-200",
};

const CATEGORY_LABELS: Record<string, string> = {
  technology: "Tech",
  "artificial-intelligence": "AI",
  startups: "Startups",
  cybersecurity: "Cybersecurity",
};

const CATEGORY_HREFS: Record<string, string> = {
  technology: "/tech",
  "artificial-intelligence": "/ai",
  startups: "/startups",
  cybersecurity: "/cybersecurity",
};

export function CategoryPill({
  category,
  active = false,
}: {
  category: string;
  active?: boolean;
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors";
  const style = active
    ? "bg-gray-900 text-white"
    : CATEGORY_STYLES[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";

  const href = CATEGORY_HREFS[category];

  if (href) {
    return (
      <Link href={href} className={`${base} ${style}`}>
        {CATEGORY_LABELS[category] || category}
      </Link>
    );
  }

  return (
    <span className={`${base} ${style}`}>
      {CATEGORY_LABELS[category] || category}
    </span>
  );
}
