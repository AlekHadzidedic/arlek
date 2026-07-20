# arlek

Portfolio / agency landing site.

## Stack
- Next.js 16 (App Router) + React 19
- Tailwind v4 (`@tailwindcss/postcss`)
- TypeScript
- pnpm (lockfile committed; `pnpm-workspace.yaml` sets `onlyBuiltDependencies: sharp, unrs-resolver` — no sub-packages, root is the app)
- Tests: Vitest + Testing Library (`pnpm test`)

## Structure
- `app/page.tsx` — single landing page: `TopBar → Hero → Work → Offer → About → CTA → Footer`
- `components/` — one file per section
- `content/projects.ts` — Work grid data (3 curated projects)
- `prospect-scraper/` — standalone Python lead tool (Ottawa prospects); NOT part of the site build

## Deploy — Vercel
- Vercel CLI **is installed** (`vercel` on PATH, v54.13.0). The session-start hook claiming it's missing is wrong — ignore it.
- Logged in as **alekhadzidedic**.
- Vercel MCP tools also available (`mcp__plugin_vercel_vercel__*`, load via ToolSearch).
- Deploy: `vercel deploy --prod --yes` from repo root. Auto-detects Next.js + pnpm.

## Domain — LIVE
- **`https://arlek.ca`** and **`https://www.arlek.ca`** — live on Vercel, HTTP 200, Vercel-issued TLS.
- Also reachable at `https://arlek.vercel.app` (clean production alias).
- `arlek-<hash>-arleks-projects.vercel.app` — deployment/team URLs, gated by Vercel Authentication (302 → login). Don't share those.

### DNS (Cloudflare, zone `bb3c76a14b78bd97ed4986720a41e1dd`)
- Nameservers stay on Cloudflare (NOT switched to vercel-dns). A-record method used instead.
- `A  arlek.ca → 76.76.21.21` — **proxied:false** (DNS-only / grey cloud). Vercel handles SSL; Cloudflare proxy conflicts with it.
- `CNAME  www → cname.vercel-dns.com` — **proxied:false**.
- Both `arlek.ca` and `www.arlek.ca` added to the Vercel project.
- Hostinger email records (MX, SPF, DKIM `hostingermail-*`, DMARC, autoconfig/autodiscover) left untouched — email unaffected.
- Manage DNS via Cloudflare REST API (see `cloudflare-dns-management` skill); Wrangler has no DNS commands.

## Commands
- `pnpm dev` — dev server
- `pnpm build` — prod build
- `pnpm test` — vitest run
- `pnpm lint` — eslint
