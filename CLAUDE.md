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

## Look and feel — the house style

The whole site is one idea: **a terminal session that decrypts itself.** Dark, monospaced, ruled into sections, mostly still — with one green accent and one motion vocabulary (text and images resolving from scrambled to legible). Any new section must read as part of that session, not as a card dropped onto it.

### Tokens (`app/globals.css`, `@theme`)
Never hardcode a hex or a one-off grey. Use these:

| Token | Value | Used for |
| --- | --- | --- |
| `bg` | `#080809` | page |
| `bg-2` | `#0F0F11` | inside frames/panels only |
| `fg` | `#FAFAFA` | headings, the "after" side, emphasis |
| `fg-2` | `#B7B7BD` | body copy |
| `fg-3` | `#7E7E86` | meta, labels, the "before" side, counters |
| `accent` | `#4ADE80` | see rationing below |
| `line` | `rgba(250,250,250,.08)` | every default rule and border |
| `line-2` | `rgba(250,250,250,.14)` | hover borders, emphasised frames, pills |

Contrast rule: **never dim a token with an opacity modifier** (`text-fg-3/70` blends to ~2.95:1 and fails 4.5:1). If a thing must be quieter, it is already `fg-3` — stop there.

### Type
- Two families only: **Satoshi** (`font-sans`) for prose, **Monaspace Krypton** (`font-mono`) for everything structural — headings, section labels, buttons, captions, counters, project names. Mono headings are the signature; do not set a heading in sans.
- Fixed rem steps, not Tailwind's scale:
  - `0.6875rem` mono, uppercase, `tracking-[0.06em]`–`[0.14em]` — labels, captions, meta, counters, footer
  - `0.8125rem` — buttons, diff rows, desktop-dense body
  - `0.9375rem`, `leading-[1.6]` — body prose, `max-w-[52ch]`–`[56ch]`
  - `1.0625rem` mono semibold `tracking-[-0.01em]` — sub-heads, project names
  - `clamp(1.25rem,2.2vw,1.75rem)` — CTA line
  - `clamp(1.75rem,4.6vw,4rem)` mono semibold `tracking-[-0.03em]` `leading-[1.14]` — the single `h1`
- Tighter tracking as size goes up, wider tracking as size goes down. Uppercase only at `0.6875rem`.

### Accent rationing
Green is a **cursor colour, not a brand fill.** It is allowed on: the `>` caret in `SectionHead`, the blinking availability dot, the blinking caret in an unresolved `DecryptFrame`, the `+` in a diff, the active row number and link hover in the work index, one emphasised frame label. It is never a background, never a button fill, never more than a few glyphs per viewport. Primary buttons are `bg-fg` on `text-bg` (white pill); secondary are `border-line-2`.

### Layout
- Full-bleed sections separated by `border-t border-line` — **no cards, no shadows, no rounded containers** except `DecryptFrame`/preview panels (`rounded-md`).
- Gutters are always `px-5 md:px-10`. Vertical rhythm `py-8`–`py-12`.
- Every section opens with `<SectionHead label=… counter=… />`: caret, name, hairline rule to a right-aligned count. This is what makes the page read as one continuous session — a section without it looks pasted in.
- Columns are split by `border-l border-line` + padding, not by gaps and boxes.
- Tap targets `min-h-[2.75rem]` on anything clickable at phone width.

### Motion
One vocabulary, all of it "resolving":
- `Decode` — headline scrambles through glyphs then settles, left to right.
- `DecryptFrame` — every client screenshot starts greyscale + phosphor-washed + scanlined with a churning label, and resolves to full colour when scrolled to. `revealOnce` for pairs that must be readable together; the default resolves only while the frame is the one being read, so at most one bright rectangle is on screen.
- `cursor-blink` at 1.15s steps — the only ambient motion.
- No fades-in-on-scroll, no parallax, no easing libraries. Transitions are colour/opacity/filter only.
- `prefers-reduced-motion` is honoured globally in `globals.css`; frames resolve instantly under it.

### Voice
Lowercase-plain, specific, no marketing adjectives. Claims come with a number or a screenshot. Comments in components explain *why* a layout decision was made, in prose — match that when editing.

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
