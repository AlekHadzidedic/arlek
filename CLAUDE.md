# arlek

Portfolio / agency landing site.

## Stack
- Next.js 16 (App Router) + React 19
- Tailwind v4 (`@tailwindcss/postcss`)
- TypeScript
- pnpm (lockfile committed; `pnpm-workspace.yaml` sets `onlyBuiltDependencies: sharp, unrs-resolver` — no sub-packages, root is the app)
- Tests: Vitest + Testing Library (`pnpm test`). NOT required for small/trivial copy or layout changes on this site — don't write or run tests for those, and don't block on stale assertions.

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
- Pushing `main` also deploys production (GitHub integration is connected), so a push and a `--prod` deploy are the same event — do not do both.

## Workflow on this repo
- **Ship straight to `main`. No PRs, no preview deploys, no review branches.** Verify locally first — `pnpm build`, `pnpm test`, and a look at the rendered page — then push. If a background-session guard forces a worktree, finish there, fast-forward `main`, push, and delete the branch. Do not offer a preview URL as a substitute for shipping.
  - Why: preview deploys on this project are gated by Vercel Authentication (302 → login), so they are not viewable on a phone and buy nothing. Deploying from a worktree with no `.vercel` link also creates a stray Vercel project that then has to be deleted.
- **Tune visuals on `pnpm dev`, not through rebuild cycles.** Adjust values live in the browser (Playwright `browser_evaluate`), confirm with one screenshot, then bake the final numbers into the source and build once. Never `build → restart → screenshot` per tweak.
- Screenshot budget when checking a change: viewport crops at two widths; one full-page shot at the end if it is genuinely needed. Prefer the numbers in `design-audit/report.json` over extra screenshots for contrast/tap-target gates.

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
