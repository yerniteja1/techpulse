export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-video w-full animate-pulse bg-gray-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-3">
        <div className="h-3 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mb-8 aspect-video w-full animate-pulse rounded-lg bg-gray-200" />
      <div className="flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
      </div>
    </article>
  );
}
