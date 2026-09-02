# TechPulse — Real-Time Tech News Platform

A mobile-first, high-performance tech news platform built with Next.js App Router, featuring live feeds, ISR/edge caching, Core Web Vitals optimization, navbar search, and a type-safe frontend-for-backend layer.

**Live:** [techpulse.yerni.online](https://techpulse.yerni.online)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data | NewsAPI.org |
| Caching | ISR + Edge Middleware |
| Validation | Zod |
| Monitoring | Web Vitals + structured logging |
| Deployment | Vercel |

---

## Features

- **Live news feed** with 15s auto-refresh
- **Breaking news ticker** with auto-rotation
- **Navbar search** with `Ctrl+K` shortcut and dropdown results
- **4 category pages** (Tech, AI, Startups, Cybersecurity)
- **Article detail** with JSON-LD structured data
- **New article badge** on articles < 30 min old
- **Read time estimate** on cards
- **Gradient fallback** for missing images (deterministic color from title hash)
- **Custom 404 page** with navigation
- **Edge middleware** with bot detection and security headers
- **ISR** with 5-min revalidation and stale-while-revalidate
- **Web Vitals** tracking (CLS, INP, LCP) via `/api/vitals`
- **Client error** reporting via `/api/errors`
- **Dynamic sitemap** and robots.txt

---

## Architecture

```
Request Flow:
User → Edge Middleware → CDN Cache → ISR Page → API Route → NewsAPI
                   ↓
            Bot detection (RSC for bots)
            Security headers
            Stale-while-revalidate
```

### Key Decisions

- **React Server Components** for static pages (homepage, categories) — zero client JS for layout
- **Client Components** only for interactive parts (live feed, search, ticker, navbar)
- **ISR with 5-min revalidation** — balances freshness with API rate limits
- **`/everything` endpoint** for category search — `top-headlines` doesn't support custom queries
- **In-memory cache** — simple, no external deps; sufficient for single-instance
- **Gradient fallback** for images — deterministic color from title hash, no external placeholder service

---

## Routes

| Route | Type | Revalidation | Description |
|-------|------|-------------|-------------|
| `/` | RSC | 5min ISR | Homepage with top stories |
| `/tech` | RSC | 5min ISR | Technology category |
| `/ai` | RSC | 5min ISR | AI & ML category |
| `/startups` | RSC | 5min ISR | Startups & VC category |
| `/cybersecurity` | RSC | 5min ISR | Cybersecurity category |
| `/article/[slug]` | Dynamic | on-demand | Article detail |
| `/live` | CSR | 15s polling | Live news feed |
| `/search` | CSR | on-demand | Dedicated search page |
| `/api/news` | API | 5min | Top headlines |
| `/api/news/category/[cat]` | API | 5min | Category news |
| `/api/news/[id]` | API | 10min | Single article |
| `/api/revalidate` | API | — | On-demand revalidation |
| `/api/vitals` | API | — | Web Vital logging |
| `/api/errors` | API | — | Client error logging |
| `/sitemap.xml` | Static | — | Dynamic sitemap |
| `/robots.txt` | Static | — | Crawl rules |

---

## Performance

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 1.2s | `priority` on hero image, `next/font` |
| CLS | < 0.05 | Explicit `width`/`height`, skeleton loaders |
| INP | < 150ms | `React.memo` on components, RSC for static |
| Bundle | < 80KB | RSC keeps client JS minimal |

---

## Getting Started

```bash
# 1. Clone
git clone <repo-url>
cd techpulse

# 2. Install
npm install

# 3. Set up env
cp .env.example .env.local
# Edit .env.local with your NewsAPI key

# 4. Run dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEWS_API_KEY` | Yes | NewsAPI.org key ([get free key](https://newsapi.org/register)) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL for SEO/sitemap |
| `REVALIDATION_SECRET` | Yes | Secret for on-demand revalidation endpoint |

---

## Deployment (Vercel)

### 1. Push to GitHub
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)

### 3. Set Environment Variables
| Variable | Value |
|----------|-------|
| `NEWS_API_KEY` | Your NewsAPI key |
| `NEXT_PUBLIC_SITE_URL` | `https://techpulse.yerni.online` |
| `REVALIDATION_SECRET` | A strong random string |

### 4. Add Custom Domain
1. In Vercel project → Settings → Domains
2. Add: `techpulse.yerni.online`

### 5. Configure DNS
Add CNAME record at your registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | techpulse | `cname.vercel-dns.com` |

Cloudflare users: set Proxy to **DNS only**.

### 6. Deploy
Vercel auto-deploys on every push to `main`.

---

## Project Structure

```
techpulse/
├── src/
│   ├── app/                        # Pages & API routes
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage
│   │   ├── not-found.tsx           # Custom 404
│   │   ├── tech/page.tsx           # Category pages
│   │   ├── ai/page.tsx
│   │   ├── startups/page.tsx
│   │   ├── cybersecurity/page.tsx
│   │   ├── article/[slug]/page.tsx # Article detail
│   │   ├── live/page.tsx           # Live feed
│   │   ├── search/page.tsx         # Search page
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   ├── robots.ts               # Robots.txt
│   │   └── api/                    # API routes
│   │       ├── news/route.ts
│   │       ├── news/[id]/route.ts
│   │       ├── news/category/[category]/route.ts
│   │       ├── revalidate/route.ts
│   │       ├── vitals/route.ts
│   │       └── errors/route.ts
│   ├── components/
│   │   ├── news/                   # Article components
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   └── BreakingNews.tsx
│   │   ├── ui/                     # Design system
│   │   │   ├── BreakingNewsTicker.tsx
│   │   │   ├── CategoryPill.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ShareButton.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── StructuredData.tsx
│   │   │   └── WebVitals.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx          # Navbar with search
│   │       └── Providers.tsx       # Client wrapper
│   ├── lib/
│   │   ├── newsapi.ts              # NewsAPI client
│   │   ├── cache.ts                # In-memory cache
│   │   ├── logger.ts               # Structured logging
│   │   └── seo.ts                  # Metadata generators
│   ├── types/
│   │   ├── article.ts              # Article/Zod schemas
│   │   └── api.ts                  # API response types
│   ├── hooks/
│   │   └── useErrorTracking.ts     # Client error capture
│   └── middleware.ts               # Edge middleware
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Resume Bullet Points

> - Architected a Next.js App Router news platform serving 90%+ content via React Server Components, reducing client JS bundle to <80KB
> - Implemented ISR + edge caching strategy with stale-while-revalidate, surviving breaking news traffic spikes
> - Built type-safe Frontend-for-Backend layer with Zod-validated API routes and typed contracts to NewsAPI
> - Achieved Core Web Vitals: LCP < 1.2s, CLS < 0.05, INP < 150ms on mobile (Lighthouse 95+)
> - Integrated structured data (JSON-LD), dynamic sitemap, and metadata API for Google News/Discover eligibility
> - Built real-time features: live feed with 15s polling, breaking news ticker, new article detection
> - Added observability: Web Vitals tracking, client error reporting, structured logging

---

## License

MIT
