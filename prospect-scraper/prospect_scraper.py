#!/usr/bin/env python3
"""
prospect_scraper.py  —  Ottawa trades & industrial prospect finder.

Deterministic re-implementation of the LLM-agent prospecting run.
~80% is pure regex/heuristics over Firecrawl output (zero LLM tokens).
The fuzzy 20% (design era, owner-vs-chain, notes) is an OPTIONAL Haiku
pass over survivors only — gated on ANTHROPIC_API_KEY, degrades to
heuristics if absent.

Requires: Python 3.9+, the authenticated `firecrawl` CLI on PATH.
Optional: ANTHROPIC_API_KEY env var (for the judge pass).

Usage:
    python prospect_scraper.py                 # all verticals, full run
    python prospect_scraper.py --limit 15 --max-pages 4
    python prospect_scraper.py --verticals machine_shops,interlock
    python prospect_scraper.py --no-judge      # heuristics only, 0 tokens
    python prospect_scraper.py --out ./out

Cost model: discovery + scrape + score cost ZERO tokens. Firecrawl
credits are cached two ways (local disk + server --max-age), so re-runs
are near-free. The judge pass is ~1 tiny Haiku call per survivor.
"""

import argparse
import csv
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from collections import OrderedDict
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

# --------------------------------------------------------------------------
# CONFIG
# --------------------------------------------------------------------------

GEO = ["Ottawa", "Kanata", "Orleans", "Nepean", "Stittsville", "Carp",
       "Greely", "Manotick", "Barrhaven", "Gloucester"]

# Ontario-side only. These strings in an address/site => Quebec, disqualify.
QUEBEC_FLAGS = ["gatineau", "hull", "aylmer", "quebec", "québec", "qc "]

# Wrong-"Ottawa" (US) + other-province markers => not our market, drop.
WRONG_MARKET_FLAGS = [
    "ottawa, oh", "ottawa, il", "ottawa, ks", "ottawa, ohio", "ottawa, illinois",
    "ottawa, kansas", ", oh ", ", il ", ", ks ", "united states", "u.s.a", "zip code",
]
# Positive proof the business is actually in the Ottawa-ON market.
ONTARIO_PROOF = [g.lower() for g in GEO] + ["ontario", ", on ", ", on,", " on ", "k1", "k2",
    "k4", "k0a", "613", "343"]

# Vertical -> (label, group, [discovery queries])
VERTICALS = OrderedDict([
    ("machine_shops",     ("Machine shops", "A",
        ["machine shop Ottawa", "CNC machining Ottawa", "precision machining Ottawa Nepean"])),
    ("metal_fab",         ("Metal fabrication / welding", "A",
        ["metal fabrication Ottawa", "custom welding Ottawa", "steel fabrication Nepean Gloucester"])),
    ("powder_coating",    ("Powder coating / finishing", "A",
        ["powder coating Ottawa", "industrial finishing Ottawa", "sandblasting powder coating Kanata"])),
    ("tool_die",          ("Tool & die / precision mfg", "A",
        ["tool and die Ottawa", "precision manufacturing Ottawa", "injection mold making Ottawa"])),
    ("millwork",          ("Custom millwork / cabinet", "A",
        ["custom millwork Ottawa", "commercial cabinetry Ottawa", "architectural millwork Kanata"])),
    ("crane_rigging",     ("Crane / rigging / industrial equip", "A",
        ["crane rental Ottawa", "rigging services Ottawa", "machinery moving millwrighting Ottawa"])),
    ("hvac",              ("Commercial HVAC / mechanical", "A",
        ["commercial HVAC contractor Ottawa", "mechanical contractor Ottawa", "HVAC installation Nepean Kanata"])),
    ("electrical",        ("Commercial electrical", "A",
        ["commercial electrician Ottawa", "electrical contractor Ottawa", "industrial electrical Nepean"])),
    ("excavation_septic", ("Excavation / septic", "B",
        ["excavation contractor Ottawa", "septic system installation Ottawa", "site excavation Carp Stittsville"])),
    ("interlock",         ("Interlock / hardscaping", "B",
        ["interlock Ottawa", "hardscaping interlocking pavers Kanata Barrhaven", "retaining wall landscape construction Ottawa"])),
    ("tree_services",     ("Tree services / arborists", "B",
        ["tree removal Ottawa", "arborist Ottawa", "tree service Orleans Barrhaven"])),
    ("concrete",          ("Concrete / foundation / waterproofing", "B",
        ["foundation repair Ottawa", "basement waterproofing Ottawa", "concrete contractor Nepean Orleans"])),
    ("deck_fence",        ("Deck & fence builders", "B",
        ["custom deck builder Ottawa", "fence installation Ottawa", "deck contractor Barrhaven Orleans"])),
    ("well_drilling",     ("Well drilling / water treatment", "B",
        ["well drilling Ottawa", "water treatment Ottawa", "well pump water softener Manotick Carp"])),
    ("paving",            ("Paving / asphalt sealing", "B",
        ["asphalt paving Ottawa", "driveway sealing Ottawa", "paving contractor Nepean Orleans"])),
    ("chimney_masonry",   ("Chimney & masonry repair", "B",
        ["chimney repair Ottawa", "masonry repair Ottawa", "brick stone repointing Nepean"])),
    ("garage_door",       ("Garage door installation", "B",
        ["garage door installation Ottawa", "garage door repair Ottawa", "garage doors Kanata Barrhaven"])),
    ("mobile_welding",    ("Mobile welding", "B",
        ["mobile welding Ottawa", "on-site welding Ottawa", "portable welding services Nepean"])),
    ("boat_marine",       ("Boat / marine repair", "B",
        ["boat repair Ottawa", "marine service Ottawa", "outboard motor repair Manotick"])),
])

# Directory / aggregator domains: usable to learn a name, never a candidate site.
DIRECTORY_DOMAINS = {
    "yelp.com", "yellowpages.ca", "yellowpages.com", "reddit.com", "facebook.com",
    "instagram.com", "kijiji.ca", "homestars.com", "houzz.com", "bbb.org",
    "google.com", "maps.google.com", "linkedin.com", "indeed.com", "glassdoor.com",
    "tripadvisor.com", "cylex-canada.ca", "canpages.ca", "opendi.ca", "n49.com",
    "threebestrated.ca", "bark.com", "trustpilot.com", "profilecanada.com",
    "youtube.com", "twitter.com", "x.com", "pinterest.com", "yellow.place",
    "ourbis.ca", "goldbook.ca", "ca.enrollbusiness.com", "storeboard.com",
    "namesandnumbers.com", "2findlocal.com", "fyple.ca", "ca.locanto.info",
    "manta.com", "chamberofcommerce.com", "brownbook.net", "hotfrog.ca",
    "wheree.com", "iglobal.co", "expressbusinessdirectory.com", "biztobiz.org",
    "clutch.co", "angi.com", "thumbtack.com", "networx.com", "porch.com",
}

# Government / institutional domains — never a small-business prospect.
GOV_MARKERS = ("ottawa.ca", ".gov", ".gc.ca", "canada.ca", "ontario.ca")

# Free-tier / DIY site fingerprints -> free_template signal.
FREE_TEMPLATE_MARKERS = [
    "wix.com", "wixstatic", "_wix", "godaddy", "websitebuilder", "weebly",
    "squarespace", "jimdo", "sitebuilder", "webnode", "yola.com", "webs.com",
    "1and1", "ionos", "wordpress.com/wp-content",
]

# "Already has a modern agency vendor" fingerprints -> size FAIL leans.
VENDOR_MARKERS = [
    "onetrust", "cookiebot", "cookieyes", "termly", "iubenda",  # consent managers
    "hubspot", "marketo", "pardot",  # marketing automation
]

# Opt-out / no-solicitation language -> optout_notice TRUE, disqualify.
OPTOUT_PATTERNS = [
    r"no\s+solicitation", r"do\s+not\s+contact\s+(us\s+)?for\s+marketing",
    r"no\s+unsolicited", r"we\s+do\s+not\s+accept\s+.{0,20}solicit",
    r"telemarketers?\s+.{0,20}(not|no)", r"no\s+marketing\s+(emails?|inquiries)",
]

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+?1[\s.\-]?)?\(?(?:6(?:13|43)|8(?:19|73))\)?[\s.\-]?\d{3}[\s.\-]?\d{4}")
YEAR_RE = re.compile(r"\b(19|20)\d{2}\b")
COPYRIGHT_YEAR_RE = re.compile(r"(?:©|&copy;|copyright)\s*\D{0,6}((?:19|20)\d{2})", re.I)

GENERIC_LOCALPARTS = {"info", "sales", "contact", "office", "admin", "general",
                      "hello", "service", "support", "estimates", "quotes", "email"}

HERE = Path(__file__).resolve().parent
CACHE_DIR = HERE / ".cache"
SERVER_CACHE_MS = 7 * 24 * 3600 * 1000  # reuse Firecrawl server cache up to 7 days

SCHEMA = ["business_name", "vertical", "group", "website_url", "city_area", "email",
          "email_source_url", "owner_name", "phone", "site_score", "site_signals",
          "size_check", "optout_notice", "qualified", "disqualify_reason", "notes"]


# --------------------------------------------------------------------------
# Firecrawl CLI wrappers (with local disk cache)
# --------------------------------------------------------------------------

def _firecrawl_bin():
    for name in ("firecrawl", "firecrawl.cmd", "firecrawl.ps1"):
        p = shutil.which(name)
        if p:
            return p
    sys.exit("ERROR: `firecrawl` CLI not found on PATH. Install + authenticate it first.")


FIRECRAWL = None


def _run(args, timeout=90):
    global FIRECRAWL
    if FIRECRAWL is None:
        FIRECRAWL = _firecrawl_bin()
    try:
        r = subprocess.run([FIRECRAWL, *args], capture_output=True, text=True,
                           timeout=timeout, encoding="utf-8", errors="replace")
    except subprocess.TimeoutExpired:
        return None
    out = (r.stdout or "").strip()
    if not out:
        return None
    # --json output is a single JSON value; be tolerant of a stray leading log line.
    if not out.startswith(("{", "[")):
        i = min([x for x in (out.find("{"), out.find("[")) if x >= 0] or [-1])
        if i < 0:
            return None
        out = out[i:]
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return None


def fc_search(query, limit):
    d = _run(["search", query, "--limit", str(limit), "--country", "CA",
              "--sources", "web", "--json"])
    if not d:
        return []
    web = (d.get("data") or {}).get("web") or d.get("web") or []
    return [{"url": r.get("url", ""), "title": r.get("title", ""),
             "desc": r.get("description", "")} for r in web if r.get("url")]


def fc_scrape(url):
    """Return dict with markdown/html/links. Local-cached by URL hash."""
    CACHE_DIR.mkdir(exist_ok=True)
    key = hashlib.sha1(url.encode()).hexdigest()[:16]
    cf = CACHE_DIR / f"{key}.json"
    if cf.exists():
        try:
            return json.loads(cf.read_text(encoding="utf-8"))
        except Exception:
            pass
    d = _run(["scrape", url, "-f", "markdown,html,links",
              "--max-age", str(SERVER_CACHE_MS), "--json"], timeout=120)
    if not d:
        d = {}
    data = d.get("data", d) if isinstance(d, dict) else {}
    res = {"markdown": data.get("markdown", "") or "",
           "html": data.get("html", "") or "",
           "links": data.get("links", []) or [],
           "metadata": data.get("metadata", {}) or {}}
    cf.write_text(json.dumps(res), encoding="utf-8")
    return res


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

def reg_domain(url):
    """Registrable-ish domain: strip scheme, www, port. eshop.foo.co -> foo.co (approx)."""
    u = (url or "").strip()
    if not u:
        return ""
    if not re.match(r"^https?://", u):
        u = "http://" + u
    host = urlparse(u).netloc.lower().split(":")[0]
    host = re.sub(r"^www\.", "", host)
    parts = host.split(".")
    if len(parts) >= 3 and parts[-2] in ("co", "com", "org", "net", "gov") and parts[-1] == "ca":
        return ".".join(parts[-3:])   # foo.co.uk style / foo.on.ca handled loosely
    return ".".join(parts[-2:]) if len(parts) >= 2 else host


def is_directory(url):
    return reg_domain(url) in DIRECTORY_DOMAINS


def csv_field(x):
    return "" if x is None else str(x)


# --------------------------------------------------------------------------
# Discovery
# --------------------------------------------------------------------------

def discover(vert_id, queries, limit):
    seen, cands = set(), []
    for q in queries:
        for hit in fc_search(q, limit):
            dom = reg_domain(hit["url"])
            if not dom or is_directory(hit["url"]):
                continue
            if dom in seen:
                continue
            seen.add(dom)
            # normalize to homepage
            home = f"https://{dom}/"
            cands.append({"domain": dom, "home": home,
                          "title": hit["title"], "desc": hit["desc"]})
    return cands


# --------------------------------------------------------------------------
# Scrape a candidate: homepage + contact/about pages
# --------------------------------------------------------------------------

CONTACT_HINTS = ("contact", "about", "quote", "reach", "get-in-touch", "connect")


def gather_pages(home, max_pages):
    pages = []
    hp = fc_scrape(home)
    pages.append((home, hp))
    dom = reg_domain(home)
    picked = set()
    for link in hp.get("links", []):
        if len(pages) >= max_pages:
            break
        lu = link if isinstance(link, str) else (link.get("url") if isinstance(link, dict) else "")
        if not lu or reg_domain(lu) != dom:
            continue
        low = lu.lower()
        if any(h in low for h in CONTACT_HINTS) and lu not in picked:
            picked.add(lu)
            pages.append((lu, fc_scrape(lu)))
            time.sleep(0.3)  # be polite to small hosts
    return pages


# --------------------------------------------------------------------------
# Scoring (deterministic)
# --------------------------------------------------------------------------

def extract_contact(pages, domain):
    """Return (email, email_source_url, phone, optout_bool, owner_guess)."""
    email = email_src = phone = ""
    optout = False
    owner = ""
    for url, pg in pages:
        text = pg.get("markdown", "") + "\n" + pg.get("html", "")
        low = text.lower()
        if not optout and any(re.search(p, low) for p in OPTOUT_PATTERNS):
            optout = True
        if not phone:
            m = PHONE_RE.search(text)
            if m:
                phone = m.group(0).strip()
        if not email:
            best = None
            for m in EMAIL_RE.finditer(text):
                addr = m.group(0)
                d = reg_domain("http://" + addr.split("@", 1)[1])
                if d != domain:
                    continue  # OWN-DOMAIN rule (CASL)
                lp = addr.split("@", 1)[0].lower()
                # prefer a named person over generic mailbox
                if lp not in GENERIC_LOCALPARTS and "." in lp:
                    best = addr; email_src = url; break
                if best is None:
                    best = addr; email_src = url
            if best:
                email = best
    return email, email_src, phone, optout, owner


def score_site(pages, home):
    signals = []
    joined_md = "\n".join(p.get("markdown", "") for _, p in pages)
    joined_html = "\n".join(p.get("html", "") for _, p in pages)
    low_md = joined_md.lower()
    low_html = joined_html.lower()
    now_year = datetime.now().year

    # 1. no_ssl — homepage served over http (or http asset links)
    if home.startswith("http://") or "http://" in low_html.replace("http://www.w3.org", ""):
        # only count if the site's own resources are http
        if home.startswith("http://"):
            signals.append("no_ssl")

    # 2. footer_year_2021_or_older_or_none
    cy = COPYRIGHT_YEAR_RE.search(joined_md) or COPYRIGHT_YEAR_RE.search(joined_html)
    if cy:
        if int(cy.group(1)) <= 2021:
            signals.append("footer_year_2021_or_older")
    else:
        signals.append("footer_year_none")

    # 3. free_template
    if any(mk in low_html for mk in FREE_TEMPLATE_MARKERS):
        signals.append("free_template")

    # 4. design_pre_2018 (heuristic proxies: layout tables / flash / old doctype)
    table_layout = low_html.count("<table") >= 3 and "display:grid" not in low_html and "flex" not in low_html
    if table_layout or ".swf" in low_html or "<font" in low_html or "marquee" in low_html:
        signals.append("design_pre_2018")

    # 5. no_clear_cta
    cta = any(k in low_md for k in ("get a quote", "request a quote", "free quote",
              "book now", "book online", "schedule", "contact form")) or "tel:" in low_html
    if not cta:
        signals.append("no_clear_cta")

    # 6. no_social_proof
    if not any(k in low_md for k in ("review", "testimonial", "★", "5-star", "5 star",
               "google rating", "what our clients", "what our customers")):
        signals.append("no_social_proof")

    # 7. broken_elements (placeholder text / lorem ipsum / under construction)
    if any(k in low_md for k in ("lorem ipsum", "under construction", "coming soon",
           "page not found", "info@website.com", "your-email@")):
        signals.append("broken_elements")

    # 8. stale_content (newest year found on site is >= 2 years old)
    years = [int(y) for y in YEAR_RE.findall(joined_md)]
    if years and max(years) <= now_year - 2:
        signals.append("stale_content")

    # 9. slow_load proxy: many raster <img> without lazy / webp
    imgs = low_html.count("<img")
    if imgs >= 25 and "loading=\"lazy\"" not in low_html and ".webp" not in low_html:
        signals.append("slow_load")

    # de-dupe footer variants into one point
    signals = list(dict.fromkeys(signals))
    return len(signals), signals


def size_check(pages):
    """Return (pass_bool, reason). Conservative small-shop heuristics."""
    low = "\n".join(p.get("markdown", "").lower() + p.get("html", "").lower() for _, p in pages)
    # chain / big markers
    if any(k in low for k in ("procurement portal", "investor relations", "our locations",
           "nationwide", "across canada", "franchise opportunit")):
        return False, "FAIL - chain/procurement/multi-location markers"
    if "careers" in low and low.count("apply now") >= 5:
        return False, "FAIL - 5+ open corporate roles"
    if any(v in low for v in VENDOR_MARKERS):
        return False, "FAIL - modern agency/consent vendor present (already has a vendor)"
    # count distinct location addresses (very rough)
    locs = len(set(re.findall(r"\b[A-Z][a-z]+,\s*(?:ON|Ontario)\b", "\n".join(p.get("markdown", "") for _, p in pages))))
    if locs >= 3:
        return False, f"FAIL - {locs}+ office locations listed"
    return True, "PASS - no chain/franchise/large-team markers detected"


def market_ok(pages, domain):
    """True only if the site proves Ottawa-ON presence and shows no wrong-market flags."""
    if any(g in domain for g in GOV_MARKERS):
        return False
    low = "\n".join(p.get("markdown", "").lower() for _, p in pages)
    if any(f in low for f in QUEBEC_FLAGS):
        return False
    if any(f in low for f in WRONG_MARKET_FLAGS):
        return False
    return any(p in low for p in ONTARIO_PROOF)


# --------------------------------------------------------------------------
# Optional Haiku judge (survivors only) — urllib, no external deps
# --------------------------------------------------------------------------

def judge_batch(candidate):
    """Confirm design era, owner name, and write a notes line. Returns dict or None."""
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    feat = {
        "business_name": candidate["business_name"],
        "vertical": candidate["vertical"],
        "site_signals": candidate["site_signals"],
        "site_score": candidate["site_score"],
        "homepage_excerpt": candidate["_excerpt"][:2500],
    }
    prompt = (
        "You are qualifying a small-business cold-outreach prospect (website redesign offer). "
        "Given these extracted features + a homepage excerpt, return STRICT JSON with keys: "
        "owner_name (string, '' if none found), is_small_owner_operated (true/false), "
        "notes (<=200 chars: services emphasized, pain points, testimonial angle, seasonal urgency). "
        "Do not invent an owner name.\n\nFEATURES:\n" + json.dumps(feat)
    )
    body = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 300,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            data = json.loads(r.read())
        txt = data["content"][0]["text"]
        i, j = txt.find("{"), txt.rfind("}")
        return json.loads(txt[i:j + 1])
    except Exception:
        return None


# --------------------------------------------------------------------------
# Evaluate one candidate -> row dict
# --------------------------------------------------------------------------

def evaluate(cand, label, group, max_pages):
    home, domain = cand["home"], cand["domain"]
    pages = gather_pages(home, max_pages)
    if not any(p.get("markdown") for _, p in pages):
        return None  # dead / unscrapeable, skip silently

    if not market_ok(pages, domain):
        return None  # Ottawa-ON only; drops wrong-Ottawa, QC, gov, unproven

    email, email_src, phone, optout, _ = extract_contact(pages, domain)
    score, signals = score_site(pages, home)
    size_pass, size_reason = size_check(pages)
    excerpt = pages[0][1].get("markdown", "")[:3000]

    # business name: metadata title -> og:site_name -> search title, cleaned.
    md = pages[0][1].get("metadata", {})
    meta_title = md.get("title") or md.get("ogSiteName") or cand["title"] or ""
    name = re.split(r"[|\-–—:•·]", meta_title)[0].strip()
    generic = {"", "home", "homepage", "welcome", "index", "contact", "about",
               "about us", "contact us", "untitled"}
    if name.lower() in generic:
        name = (md.get("ogSiteName") or "").strip()
    if name.lower() in generic or not name:
        # fall back to domain root, title-cased
        root = domain.split(".")[0].replace("-", " ")
        name = root.title()

    qualified = size_pass and score >= 3 and bool(email) and not optout
    reasons = []
    if not size_pass:
        reasons.append(size_reason)
    if score < 3:
        reasons.append(f"site_score {score} < 3")
    if not email:
        reasons.append("no public own-domain email")
    if optout:
        reasons.append("opt-out notice present")

    return {
        "business_name": name, "vertical": label, "group": group,
        "website_url": home, "city_area": "",
        "email": email, "email_source_url": email_src if email else "",
        "owner_name": "", "phone": phone,
        "site_score": score, "site_signals": ";".join(signals),
        "size_check": size_reason,
        "optout_notice": "TRUE" if optout else "FALSE",
        "qualified": "TRUE" if qualified else "FALSE",
        "disqualify_reason": "" if qualified else "; ".join(reasons),
        "notes": "", "_excerpt": excerpt,
    }


# --------------------------------------------------------------------------
# Tiering, dedup, output
# --------------------------------------------------------------------------

def tier_of(r):
    q = r["qualified"] == "TRUE"
    sp = r["size_check"].upper().startswith("PASS")
    sc = int(r["site_score"])
    opt = r["optout_notice"] == "TRUE"
    if q:
        return "qualified"
    if sp and sc >= 3 and not opt and not r["email"] and r["phone"]:
        return "phone"
    if sp and r["email"] and not opt and sc == 2:
        return "score2"
    return "unqualified"


def write_csv(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(header)
        for r in rows:
            w.writerow([csv_field(r.get(c, "")) for c in header])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=10, help="search results per query")
    ap.add_argument("--max-pages", type=int, default=4, help="pages scraped per candidate")
    ap.add_argument("--verticals", default="", help="comma list of vertical ids (default: all)")
    ap.add_argument("--no-judge", action="store_true", help="skip Haiku pass (0 tokens)")
    ap.add_argument("--out", default=str(HERE), help="output directory")
    args = ap.parse_args()

    want = [v.strip() for v in args.verticals.split(",") if v.strip()] or list(VERTICALS)
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)

    all_rows, per_vert = [], OrderedDict()
    for vid in want:
        if vid not in VERTICALS:
            print(f"  ! unknown vertical '{vid}', skipping", file=sys.stderr); continue
        label, group, queries = VERTICALS[vid]
        print(f"[{vid}] discovering...", file=sys.stderr)
        cands = discover(vid, queries, args.limit)
        print(f"[{vid}] {len(cands)} candidates -> scoring", file=sys.stderr)
        rows = []
        for c in cands:
            try:
                r = evaluate(c, label, group, args.max_pages)
            except Exception as e:
                print(f"    x {c['domain']}: {e}", file=sys.stderr); r = None
            if r:
                rows.append(r)
        per_vert[vid] = (label, group, len(rows),
                         sum(1 for r in rows if r["qualified"] == "TRUE"))
        all_rows.extend(rows)

    # Optional Haiku judge on survivors (qualified + near-miss) only.
    if not args.no_judge and os.environ.get("ANTHROPIC_API_KEY"):
        survivors = [r for r in all_rows if tier_of(r) in ("qualified", "phone", "score2")]
        print(f"[judge] {len(survivors)} survivors -> Haiku", file=sys.stderr)
        for r in survivors:
            j = judge_batch(r)
            if j:
                r["owner_name"] = j.get("owner_name", "") or r["owner_name"]
                r["notes"] = j.get("notes", "") or r["notes"]
                if j.get("is_small_owner_operated") is False and r["size_check"].startswith("PASS"):
                    r["size_check"] = "FAIL - judge: not owner-operated/small"
                    r["qualified"] = "FALSE"

    # strip internal field
    for r in all_rows:
        r.pop("_excerpt", None)

    # dedup across verticals by domain: keep best (qualified, then score)
    groups = OrderedDict()
    for r in all_rows:
        groups.setdefault(reg_domain(r["website_url"]), []).append(r)
    merged = []
    for dom, rs in groups.items():
        if len(rs) == 1:
            merged.append(rs[0]); continue
        best = max(rs, key=lambda r: (r["qualified"] == "TRUE", int(r["site_score"])))
        others = sorted({x["vertical"] for x in rs} - {best["vertical"]})
        if others:
            best["notes"] = (best["notes"] + " | Also under: " + ", ".join(others)).strip(" |")
        merged.append(best)

    order = {"qualified": 0, "phone": 1, "score2": 2, "unqualified": 3}
    for r in merged:
        r["tier"] = tier_of(r)
    merged.sort(key=lambda r: (order[r["tier"]], -int(r["site_score"])))

    # write outputs
    write_csv(out / "prospects-master.csv", ["tier"] + SCHEMA, merged)
    write_csv(out / "prospects.csv", SCHEMA, merged)
    write_csv(out / "prospects-outreach.csv", SCHEMA,
              [r for r in merged if r["tier"] == "qualified"])
    write_csv(out / "prospects-phone-tier.csv", SCHEMA,
              [r for r in merged if r["tier"] == "phone"])
    write_csv(out / "prospects-score2-tier.csv", SCHEMA,
              [r for r in merged if r["tier"] == "score2"])

    # run summary
    from collections import Counter
    tc = Counter(r["tier"] for r in merged)
    lines = ["# Prospect Scraper — Run Summary", "",
             f"Generated by prospect_scraper.py (deterministic).",
             f"Total rows: {len(merged)} | qualified {tc['qualified']} · "
             f"phone {tc['phone']} · score2 {tc['score2']} · unqualified {tc['unqualified']}",
             "", "## Per-vertical (post-scrape, pre-dedup)", "",
             "| Vertical | Group | Evaluated | Qualified |", "|---|---|---|---|"]
    for vid, (label, group, n, q) in per_vert.items():
        lines.append(f"| {label} | {group} | {n} | {q} |")
    (out / "run-summary.md").write_text("\n".join(lines), encoding="utf-8")

    print(f"\nDONE. {len(merged)} rows -> {out}", file=sys.stderr)
    print(f"  qualified {tc['qualified']} | phone {tc['phone']} | "
          f"score2 {tc['score2']} | unqualified {tc['unqualified']}", file=sys.stderr)


if __name__ == "__main__":
    main()
