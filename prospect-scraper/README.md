# Prospect Scraper — Ottawa trades & industrial

Finds small, owner-operated Ottawa-area businesses with **bad websites** and a
**public own-domain email** — targets for a website-redesign offer. CASL-aware
(own-domain email + no opt-out notice are hard gates).

`prospect_scraper.py` is a deterministic rewrite of the original multi-agent run.
Discovery, scraping, and scoring cost **zero LLM tokens**; only an optional judge
pass over survivors touches an LLM.

## Requirements
- Python 3.9+
- The `firecrawl` CLI, authenticated (`firecrawl config`). Used for web search + scrape.
- Optional: `ANTHROPIC_API_KEY` env var — enables the Haiku judge pass (owner name,
  small/owner-operated confirmation, `notes`). Without it the script runs heuristics only.

## Usage
```bash
python prospect_scraper.py                          # all 19 verticals, full run
python prospect_scraper.py --limit 15 --max-pages 4 # deeper discovery
python prospect_scraper.py --verticals machine_shops,interlock
python prospect_scraper.py --no-judge               # skip LLM entirely (0 tokens)
python prospect_scraper.py --out ./out              # output dir
```

## What it costs
| Stage | Cost |
|---|---|
| Discovery (`firecrawl search`) | Firecrawl credits, tiny |
| Scrape (home + contact/about, ≤`--max-pages`) | Firecrawl credits; **cached** to `.cache/` locally AND server-side via `--max-age` (7d), so re-runs are near-free |
| Scoring (regex/heuristics) | **0 tokens** |
| Judge pass (survivors only) | ~1 small Haiku call each; skipped with `--no-judge` or no API key |

## Outputs (written to `--out`)
- `prospects-master.csv` — every row + `tier` column (`qualified` / `phone` / `score2` / `unqualified`)
- `prospects.csv` — same rows, schema only
- `prospects-outreach.csv` — qualified (email-ready)
- `prospects-phone-tier.csv` — small + bad site, no own-domain email → phone outreach
- `prospects-score2-tier.csv` — one signal short of the badness threshold
- `run-summary.md` — per-vertical counts + tier totals

## Qualification (all must pass)
1. **Size** — small/owner-operated (heuristic: no chain/procurement/consent-vendor/3+ location markers)
2. **Bad site** — `site_score >= 3` from a 10-signal rubric (no-SSL, old footer year, free template,
   pre-2018 design proxies, no CTA, no social proof, broken elements, stale content, slow-load proxy)
3. **Contact** — an email on the business's **own domain** (CASL), and **no** opt-out/no-solicitation language

## Tuning
Config lives at the top of the script: `VERTICALS`, `GEO`, `DIRECTORY_DOMAINS`,
`FREE_TEMPLATE_MARKERS`, `ONTARIO_PROOF`, `WRONG_MARKET_FLAGS`. The Ottawa-ON geo gate
is strict (drops wrong-"Ottawa" US results, Quebec, gov). Raise `--max-pages` if legit
shops are dropped for not stating their address on the first few pages.

## Known limits vs the LLM run
- `design_pre_2018`, owner-vs-chain nuance, and `notes` are the genuinely fuzzy calls —
  heuristics approximate them; the judge pass sharpens them on survivors only.
- Business-name extraction falls back to the domain root when the page title is generic.
