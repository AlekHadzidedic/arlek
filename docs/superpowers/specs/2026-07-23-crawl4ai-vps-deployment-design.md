# crawl4ai on Hostinger VPS — Deployment & Claude Code Integration

**Date:** 2026-07-23
**Goal:** Replace paid Firecrawl ($20/mo) with self-hosted [crawl4ai](https://docs.crawl4ai.com/) on the existing Hostinger VPS (currently running n8n), and wire Claude Code to use it (MCP + skill).

## Decisions (locked)

| Decision | Choice |
|---|---|
| VPS operation | User runs commands via `!` in-session; Claude writes exact commands, verifies output before next phase |
| n8n runtime | Docker Compose — add crawl4ai as a sibling service |
| Exposure | Both: internal (n8n → docker network) **and** public (Claude Code / laptop) |
| Public hostname | Subdomain of n8n's existing domain (e.g. `crawl.<n8n-domain>`), confirmed on inspect |
| Public method | Approach A — existing reverse proxy + Cloudflare A-record + TLS |
| Claude Code integration | Both — native MCP (`/mcp/sse`) **and** a `crawl4ai` skill (curl REST wrappers) |
| Auth | Bearer token on crawl4ai; token shared with n8n (internal) + Claude Code (public) |

## Architecture

```
                        Cloudflare DNS (A crawl.<domain> -> VPS IP)
                                     |
   laptop / Claude Code  --HTTPS-->  reverse proxy (Traefik|Caddy|nginx)  --> :11235
                                                                              |
   n8n container  --HTTP http://crawl4ai:11235-->  crawl4ai container  <------+
                        (same docker network, no public hop)
```

- **New service** `crawl4ai` in the existing n8n `docker-compose.yml`.
  - Image: pinned tag (verify current stable on inspect — `:latest` tracks 0.8.x/0.9.x; 0.9 is auth-required-by-default, 0.8 auth is optional). Pin an explicit tag, configure token auth explicitly regardless.
  - `--shm-size=1g` (Chromium requirement), `mem_limit: 4g`, `restart: unless-stopped`.
  - Joined to n8n's docker network so n8n resolves `crawl4ai:11235` internally.
  - Container port `11235` **not** published to host `0.0.0.0`; only the reverse proxy reaches it (via shared network). Public access is exclusively through the proxy + TLS.
- **Internal path:** n8n HTTP Request nodes → `http://crawl4ai:11235/...` with `Authorization: Bearer <token>`.
- **Public path:** `https://crawl.<domain>/...` → proxy → container, same Bearer token.

## Components

1. **Compose service block** + optional `.llm.env`
   - `.llm.env` holds `ANTHROPIC_API_KEY` (and any other LLM keys) — **only** needed for LLM-extraction endpoints (`/llm/job`, `f=llm`). Plain scrape → markdown (`/crawl`, `/md`) needs no LLM key. Keep optional.
   - Token/auth config supplied via env or mounted `config.yml` depending on pinned version (settle on inspect).
2. **Reverse-proxy route + DNS + TLS**
   - Add `crawl.<domain>` route to whatever proxy already fronts n8n (labels for Traefik / site block for Caddy / server block for nginx).
   - Cloudflare A-record `crawl.<domain>` → VPS IP. Grey-cloud (DNS-only) if the proxy terminates TLS via Let's Encrypt; orange-cloud if we let Cloudflare terminate. Match n8n's existing pattern.
3. **Claude Code MCP registration** — crawl4ai's native `/mcp/sse`
   - `claude mcp add --transport sse crawl4ai https://crawl.<domain>/mcp/sse --header "Authorization: Bearer <token>"`
   - Gives native tool calls (`crawl`, `md`, `screenshot`, etc.) in interactive sessions.
4. **Claude Code `crawl4ai` skill** — mirrors the firecrawl skills
   - Global skill (`~/.claude/skills/crawl4ai/`) so it's available in every project, not just this repo.
   - `SKILL.md` documents curl wrappers for: scrape→markdown, full crawl, screenshot/pdf, LLM extraction. Reads base URL + token from a config/env convention.
   - Purpose: future sessions reach for crawl4ai (self-hosted) instead of firecrawl.
5. **n8n rewire** — map Firecrawl nodes → crawl4ai
   - Firecrawl `/scrape` → crawl4ai `/md` or `/crawl` (single URL).
   - Firecrawl `/crawl` → crawl4ai `/crawl` (multi-URL) or `/crawl/job` (async + webhook).
   - Field mapping documented; user edits nodes in the n8n UI (Claude can't touch the n8n DB).

## Runbook (phased — each phase is commands the user runs via `!`; verify before advancing)

### P0 — Inspect
- `docker ps` — confirm n8n container + any reverse proxy (traefik/caddy/nginx).
- Locate the compose file (`~`, `/opt`, `/root`, `docker inspect ... com.docker.compose.project.config_files`).
- Identify n8n's public domain + how TLS is done (proxy labels / Caddyfile / nginx conf / Cloudflare orange-cloud).
- `free -m` — confirm ≥4GB RAM headroom for the browser pool.
- Record the docker network name n8n is on.

### P1 — Deploy container
- Add `crawl4ai` service to compose (network, shm, mem, restart, token env).
- `docker compose up -d crawl4ai`.
- Internal health check: `docker exec <n8n-or-proxy> wget -qO- http://crawl4ai:11235/health` (or `/monitor/health`) — expect healthy.
- Internal scrape smoke test against `example.com` → markdown non-empty.

### P2 — Expose publicly
- Add proxy route for `crawl.<domain>`.
- Cloudflare A-record → VPS IP (via `cloudflare-dns-management` skill / API).
- Reload proxy; wait for TLS cert.
- Verify: `curl https://crawl.<domain>/health` and an authed scrape with `Authorization: Bearer`.
- Confirm unauthed request is rejected (token actually enforced).

### P3 — Claude Code
- `claude mcp add` (SSE, Bearer header) → `claude mcp list` shows crawl4ai connected; one tool-call scrape works.
- Write `~/.claude/skills/crawl4ai/SKILL.md` + any helper script; invoke it on a test URL.

### P4 — n8n rewire
- Duplicate one Firecrawl-using workflow, swap the node to crawl4ai internal URL, run, compare output.
- Roll out to remaining workflows.
- Cancel the Firecrawl subscription once parity confirmed.

## Testing / acceptance

- [ ] Internal: n8n container curls `http://crawl4ai:11235/md` → markdown for a known URL.
- [ ] Public: `https://crawl.<domain>/health` = 200; authed scrape returns markdown; **unauthed** scrape = 401/403.
- [ ] TLS valid (browser-trusted cert, no warning).
- [ ] Claude Code MCP: tool list includes crawl4ai; one scrape returns content.
- [ ] Claude Code skill: invoking `crawl4ai` scrapes a URL end-to-end.
- [ ] One real n8n workflow produces equivalent output to the old Firecrawl node.
- [ ] Container survives `docker compose restart` and VPS reboot (`restart: unless-stopped`).

## Risks / open items (settle during execution, not guessed now)

- **Reverse proxy identity** — Traefik vs Caddy vs nginx vs none. Determines P2 config syntax. Inspect in P0.
- **crawl4ai auth model for the pinned tag** — 0.8 optional token vs 0.9 secure-by-default JWT. Pin a known tag, read that tag's `.llm.env.example` / `config.yml`, configure token explicitly.
- **RAM pressure** — browser pool + n8n on one box. `mem_limit` caps crawl4ai; watch under load, tune concurrency.
- **JWT vs static token for machine clients** — if the pinned version forces email→JWT, prefer a static bearer via config, or gate at the proxy with a shared-secret header. Decide in P1.
- **n8n edits are manual** — Claude documents the mapping; the user applies node changes in the n8n UI.

## Out of scope

- Migrating existing scraped data.
- Multi-node / autoscaling crawl4ai.
- Changing n8n's own hosting or the arlek.ca site.

---

## AS-BUILT (completed 2026-07-23)

Deployed live. n8n + traefik never restarted (both "Up 2 days" throughout); all changes additive.

**VPS:** `root@srv1317127.hstgr.cloud` (IP `76.13.118.111`), Ubuntu, Docker 29 / Compose v5. SSH alias `vps` → key `~/.ssh/vps_crawl4ai` (dedicated ed25519, laptop-only).

**Discovered stack:** Traefik v3.6 (`n8n-traefik-1`) fronting `n8n.arlek.online`, TLS via Cloudflare **DNS-01** (resolver `myresolver`, `CF_DNS_API_TOKEN`). Domain **`arlek.online`** (CF zone `fcf2d0aad6d1c4f43b4c25ccffac0260`). Box: 3.9GB RAM, **0 swap** originally.

**What was deployed:**
- **Image:** `unclecode/crawl4ai:0.9.2` (pinned).
- **Compose:** new `crawl4ai` service in `/docker/n8n/docker-compose.override.yml` (auto-merged; n8n's `docker-compose.yml` byte-for-byte untouched, `.bak` taken anyway). `shm_size: 1gb`, `mem_limit: 2560m`, `restart: unless-stopped`, no host port publish (docker network only), Traefik labels mirroring n8n's.
- **Config:** `/docker/crawl4ai/config.yml` (extracted from the image, then tuned): `app.host 0.0.0.0`, `crawler.pool.max_pages 6`, `crawler.memory_threshold_percent 85`, `limits.max_pages 25`, `limits.wall_clock_s 180`, `limits.queue.workers 2`.
- **Auth:** static `CRAWL4AI_API_TOKEN` (64-hex) in `/docker/n8n/.env` → enforced Bearer on all endpoints (unauthed = 401). Binding `0.0.0.0` *requires* this token (startup guard). `trusted_hosts:["*"]` and no `SECRET_KEY` left as-is by design (Traefik constrains public Host; static token, not JWT).
- **Swap:** 4GB `/swapfile` added (persisted in `/etc/fstab`).
- **DNS:** `A crawl.arlek.online → 76.13.118.111`, proxied=false (mirrors n8n). TLS auto-issued by Traefik.
- **Public URL:** `https://crawl.arlek.online` (valid cert). **Internal:** `http://crawl4ai:11235`.

**Claude Code integration:**
- **MCP:** registered user-scope, SSE → `https://crawl.arlek.online/mcp/sse` with Bearer header (`~/.claude.json`). `claude mcp list` = `✔ Connected`. Tools: `md, html, screenshot, pdf, execute_js, crawl, ask`.
- **Skill:** `~/.claude/skills/crawl4ai/SKILL.md` (global). Creds: `~/.claude/crawl4ai.env`.

**Verification (all passed):** internal authed `/md` 200 + unauthed 401; public authed `/md` 200 + unauthed 401; valid TLS (no `-k`); MCP connected; skill REST fallback scraped example.com + docs.crawl4ai.com; `n8n.arlek.online` still 200; crawl4ai `healthy`, `unless-stopped`.

**Remaining (manual — needs n8n UI, Claude can't edit n8n DB):** P4 — swap Firecrawl nodes in n8n workflows to crawl4ai (`/scrape`→`/md`, `/crawl`→`/crawl` or `/crawl/job`) using internal URL `http://crawl4ai:11235` + Bearer token; then cancel the Firecrawl subscription once parity confirmed.

**Regenerate token if ever needed:** edit `CRAWL4AI_API_TOKEN` in `/docker/n8n/.env` → `docker compose up -d crawl4ai`, then update `~/.claude/crawl4ai.env` and the MCP header (`claude mcp remove crawl4ai -s user` + re-add).
