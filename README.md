# TechPulse — Real-Time Tech News Platform

A mobile-first, high-performance tech news platform built with Next.js 14 App Router, featuring live feeds, ISR/edge caching, Core Web Vitals optimization, and a type-safe frontend-for-backend layer.

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
- **Client Components** only for interactive parts (live feed, search, ticker)
- **ISR with 5-min revalidation** — balances freshness with API rate limits
- **`/everything` endpoint** for category search — `top-headlines` doesn't support custom queries
- **In-memory cache** — simple, no external deps; sufficient for single-instance

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
| `/search` | CSR | on-demand | Search articles |
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
3. Vercel will show DNS records to configure

### 5. Configure DNS at your registrar
Add these records for `yerni.online`:

| Type | Name | Value |
|------|------|-------|
| CNAME | techpulse | `cname.vercel-dns.com` |

Or if using Cloudflare:
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | techpulse | `cname.vercel-dns.com` | DNS only |

### 6. Deploy
Vercel auto-deploys on every push to `main`.

---

## Project Structure

```
techpulse/
├── src/
│   ├── app/                    # Pages & API routes
│   │   ├── layout.tsx          # Root layout (RSC)
│   │   ├── page.tsx            # Homepage
│   │   ├── tech/page.tsx       # Category pages
│   │   ├── ai/page.tsx
│   │   ├── startups/page.tsx
│   │   ├── cybersecurity/page.tsx
│   │   ├── article/[slug]/     # Article detail
│   │   ├── live/page.tsx       # Live feed (CSR)
│   │   ├── search/page.tsx     # Search (CSR)
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   ├── robots.ts           # Robots.txt
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── news/               # Article components
│   │   ├── ui/                 # Design system
│   │   └── layout/             # Providers
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript types
│   └── hooks/                  # React hooks
├── middleware.ts                # Edge middleware
└── next.config.ts              # Next.js config
```

---

## License

MIT
