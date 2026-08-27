# Fresh-Clone Audit — rothershrine v1.3.0

**Date:** 2026-08-27 · **Auditor:** independent fresh-clone review (GitHub clone → `pnpm install --frozen-lockfile` → full gate + live-site E2E)
**Environment:** Node 24.19, pnpm 11.0.0, chromium 140 (playwright build v1193)
**Scope:** `src/` + `e2e/` + configs + CI + live deployment `https://rothershrine.jesspete.shop/`
**Method:** skills `code-review-and-audit` (standard mode) — Phase 1 lint/types, Phase 2 security (OWASP 2025 + supply chain), Phase 3 manual 12-category review (Native CLI Fallback Protocol; the scripted Phase-3 scan is dominated by the 2345 vendored `skills/` files and its raw counts are not meaningful for project code), Phase 4 unit + E2E, plus live-site browser sweep.

**Confidence legend:** ✅ Verified (executed and observed) · 🧠 Reasoned (code inspection) · ⚠️ Assumed

---

## Summary by Severity

| Severity | Count | IDs |
|---|---|---|
| 🔴 Critical | 0 shipped | — |
| 🟠 High | 2 | H1, H2 |
| 🟡 Medium | 6 | M1–M6 |
| 🟢 Low | 6 | L1–L6 |
| ⚪ Info | 2 | I1, I2 |
| ✅ Passed (re-verified) | 20 | P-list below |

Prior audit (`.audit-report.md`, run on the original author machine) reported "all green". That result depended on `skills/` being an **untracked symlink** locally. In the GitHub repo `skills/` is committed (2345 tracked files), which changes tooling behavior for every fresh clone.

---

## 🟠 High

### H1 — `pnpm lint` fails on any fresh clone (gate + CI broken)
- **Location:** `eslint.config.js:7` (ignores list) · `git ls-files skills` (2345 files) · `.gitignore` (`skills/` entry ineffective for tracked files)
- **Evidence (Verified):** `pnpm lint` → **91 problems (79 errors, 12 warnings)**, all under `skills/**` (e.g. `skills/video-understand/scripts/video-understand.ts`, `skills/web-search/scripts/web_search.ts` — `no-explicit-any`, `consistent-type-imports`). Exit 1. CI (`ci.yml` Lint step) fails on every push/PR from a checkout.
- **Impact:** The documented pre-push gate (`lint && typecheck && test && test:e2e && build`) is false for every contributor who is not the original author; CI is red; docs contract ("skills is a symlink and .gitignored") does not match reality.
- **Recommended fix:** Add `"skills"` to `eslint.config.js` `ignores` (vendored content is not project code). Keep `skills/` in the repo — it is referenced by `skills-catalog.md` workflows. Sync docs to describe `skills/` as vendored-and-tracked, ignored by tooling (`eslint` ignores, `vite server.watch.ignored`; `tsc` unaffected because `include` covers `src` only).
- **Confidence:** ✅ Verified

### H2 — SkipLink activation hijacks the HashRouter route (WCAG 2.4.1 bypass broken)
- **Location:** `src/components/SkipLink.tsx` (`<a href="#main-content">`) under `HashRouter` (ADR-1); consumer `Layout.tsx`
- **Evidence (Verified):** On `http://localhost:5173/#/about`, focusing the skip link and pressing Enter changes the URL to `…/#main-content`; `HashRouter` parses that as path `/main-content` → **NotFound renders** ("This path does not lead to the shrine."). Same build serves the live site.
- **Impact:** Keyboard users who activate the skip link are ejected from the page they were reading — the accessibility mechanism causes navigation loss. WCAG 2.4.1 (Bypass Blocks) intent violated.
- **Why tests missed it:** `e2e/navigation.spec.ts` ("keyboard nav … SkipLink focuses main") asserts only `#main-content` `toBeAttached()` after Enter — the Layout always renders `<main id="main-content">`, so the assertion passes **even on the NotFound page**. Assertion strength gap.
- **Recommended fix:** `onClick` → `preventDefault()` + move focus to `#main-content` (give `<main>` `tabIndex={-1}`), keep `href` for no-JS semantics. Add unit regression test (click keeps route, moves focus) and strengthen the E2E assertion (URL unchanged, page heading unchanged, main focused).
- **Confidence:** ✅ Verified

---

## 🟡 Medium

### M1 — E2E suite fails on first run after fresh install (cold-start flake)
- **Location:** `playwright.config.ts` (default `expect` timeout 5s) · vite dev-server cold dep-optimization
- **Evidence (Verified):** First `pnpm test:e2e` after fresh `pnpm install` → `give-faq.spec.ts:6` failed with a **blank screenshot** (app not yet mounted while vite transformed ~1900 modules on demand, incl. `lucide-react`); re-run warm → 4/4 pass; full suite warm → 19/20 with only that spec affected cold. CI masks this via `retries: 2`.
- **Impact:** Local pre-push gate is flaky precisely on fresh clones — the environment where it matters most.
- **Recommended fix:** Raise `expect.timeout` (e.g. 15s) in `playwright.config.ts` with a comment; optionally document. (Non-weakening: only extends failure detection window.)
- **Confidence:** ✅ Verified

### M2 — `npm ci` fails although docs promise "`npm` works / `npm ci`"
- **Location:** `package.json` (`typescript-eslint 8.28.0` peer `typescript >=4.8.4 <5.9.0`) vs `typescript 5.9.3` · claims in `README.md` (Quick Start), `CLAUDE.md`, `rothershrine-v2_SKILL.md §2/§3`
- **Evidence (Verified):** `npm ci` → ERESOLVE error (peer conflict), exit non-zero. pnpm (which has no peer auto-failure) installs clean via frozen lockfile.
- **Impact:** Onboarding instructions fail for npm users.
- **Recommended fix:** Correct docs: pnpm is the supported path; `npm ci` requires `--legacy-peer-deps` with the current exact pins (or a future `typescript-eslint` bump supporting TS 5.9 — left as backlog to avoid a 40-minor-version tooling jump).
- **Confidence:** ✅ Verified

### M3 — Footer social links are placeholders
- **Location:** `src/components/Footer.tsx` (`https://www.facebook.com/`, `https://www.instagram.com/`, `https://www.youtube.com/`)
- **Evidence (Verified):** Official site (rothershrine.org, extracted via headless browser) links to `facebook.com/RotherShrine`, `instagram.com/rothershrine/`, `youtube.com/@rothershrine` (also `twitter.com/Rothershrine`, unused here).
- **Impact:** Content accuracy — the clone claims content fidelity; social CTAs currently dead-end at platform homepages.
- **Recommended fix:** Point the three icons at the verified URLs (aria-labels unchanged).
- **Confidence:** ✅ Verified

### M4 — No security headers on the live host (and no meta-CSP in the artifact)
- **Location:** hosting/CDN for `https://rothershrine.jesspete.shop/`; `index.html`
- **Evidence (Verified):** Response lacks `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- **Impact:** For a static SPA with no user data, risk is limited, but defense-in-depth is free at the artifact level (meta CSP) and cheap at host level.
- **Recommended fix:** Add a scoped `<meta http-equiv="Content-Security-Policy">` to `index.html` (singlefile build requires `'unsafe-inline'` for script/style — tradeoff documented; still blocks external script/img origins), plus `referrer` meta. Host-level HSTS/XCTO noted for the operator (cannot be fixed in repo).
- **Confidence:** ✅ Verified (headers observed); fix effectiveness to be verified by post-change probe

### M5 — Documentation drift from code (SKILL/AGENTS/CLAUDE/README)
Evidence per item (Verified by file read):
1. `rothershrine-v2_SKILL.md §8.2` says skip-to-content "**Not yet implemented**" while `SkipLink.tsx` exists and is rendered by `Layout` (contract contradiction inside the same doc).
2. `SKILL §15.1/§15.2` "copy-pasteable" snippets do not match `Button.tsx` (discriminated union + focus-visible/disabled classes) or `Layout.tsx` (`resolveAnchor` double-hash logic).
3. `SKILL §18` Z-index map: "Only Header owns z-50" — actual: skip-link `z-[100]`, WhatToSee jump nav `z-40`, Header dropdown `z-50`.
4. `AGENTS/CLAUDE/SKILL` call `Timeline` an "alternating rail" — actual implementation is a **left-aligned single rail** (`border-l … pl-8`); alternation (image/text order) exists in `WhatToSee`, not `Timeline`.
5. `CLAUDE.md` describes `PageHero` as "maroon-900 hero" with image `aria-hidden` — actual `bg-shrine-maroon-950`, gradients via maroon-950/900, and the image has `alt=""` but **no** `aria-hidden`.
6. Route-count phrasing inconsistent ("15 routes (7 alias pairs + 3 hash anchors)", "7 alias pairs + 4 hash anchors"): `App.tsx` has 15 content paths + `*` (16 Route entries), **6 legacy alias paths across 5 groups**, and **4 hash anchors** (`#pilgrim-center`, `#shrine-church`, `#tepeyac-hill`, `#visit`). `SKILL §5.4` snippet omits `/volunteer` and `/faq`.
7. `SKILL §7.1` `images` split "6 Pexels CDN + 4 local/derived" — actual **7 CDN + 3 local** (`heroFallback`, `wheatFallback`, `chapel`).
8. `SKILL §8.1` contrast table hexes are stale (`ink #2c2418`≠`#2a2115`, `cream #faf5eb`≠`#faf6ec`, `maroon-900 #351012`≠`#33100f`).
9. `Header` described as "sticky"/"maroon-900" — actual `position: fixed`, maroon-950/92 translucent when scrolled, transparent at top of Home.
- **Impact:** SKILL.md self-describes as byte-verified single source of truth; drift erodes agent trust exactly where it claims authority.
- **Recommended fix:** Single docs-alignment pass over all four files (bundled with post-remediation state).
- **Confidence:** ✅ Verified

### M6 — Phase-3-style tooling noise: vendored `skills/` poisons repo-wide scans
- **Location:** repo-wide scanners (`audit_runner.py` Phase 3: 2798 raw findings incl. 77 "critical" — all from `skills/**`)
- **Evidence (Verified):** `python3 skills/code-review-and-audit/scripts/audit_runner.py --mode standard` → `overall_status FAILED (CRITICAL)` driven entirely by vendored content.
- **Impact:** Any future audit/agent run inherits false positives unless scopes exclude `skills/`.
- **Recommended fix:** Document the exclusion convention (eslint ignores + scoped manual review); no code change beyond H1.
- **Confidence:** ✅ Verified

---

## 🟢 Low

| ID | Finding | Evidence | Recommendation |
|---|---|---|---|
| L1 | `@eslint/plugin-kit` ReDoS (GHSA-xffm-g5w8-qvg7), dev-transitive | `pnpm audit` → 1 low ✅ | Keep deferred until `eslint ≥9.24` bump (upstream) |
| L2 | No favicon → `/favicon.ico` 404 noise | `index.html`, `public/` | Add inline data-URI SVG favicon |
| L3 | `main.tsx` non-null `getElementById("root")!` | `src/main.tsx:6` | Replace with explicit guard/throw |
| L4 | `Accordion` lacks APG arrow-key navigation (aria-expanded/controls present) | `src/components/ui/Accordion.tsx` | Backlog: ArrowUp/Down/Home/End roving focus |
| L5 | Arbitrary `text-[11px]` / `tracking-[0.2x em]` values outside `@theme` (editorial eyebrows) | `Header.tsx`, `Home.tsx`, `NewsEvents.tsx` | Accept as intentional; note in docs (prior audit L3) |
| L6 | `package.json` `allowScripts` key is not a pnpm-recognized field (pnpm uses `pnpm.onlyBuiltDependencies`) | `package.json:56` | Informational; harmless — document or migrate key |

---

## ⚪ Info

| ID | Finding |
|---|---|
| I1 | Live build serves identical contracts to repo HEAD (route sweep 29/29) — deployment is current with `main` |
| I2 | Page components have 0% unit coverage by design (data-layer unit strategy + E2E journeys); `pnpm test:coverage` works (M1 of prior audit fixed). Documented intentionally. |

---

## ✅ Passed checks (re-verified fresh, this environment)

| # | Check | Evidence |
|---|---|---|
| P1 | `pnpm typecheck` | exit 0 (strict + noUnused*) ✅ |
| P2 | `pnpm test` | 5 files / 26 passed (3.03s) ✅ |
| P3 | `pnpm build` | `dist/index.html` 370.04 kB (gzip 108.37 kB) + `dist/images/` 4 files ✅ |
| P4 | `pnpm test:e2e` (warm) | 19–20/20 (1 cold flake → M1) ✅ |
| P5 | Versions pinned exact | no `^` in package.json; both lockfiles committed; `--frozen-lockfile` in CI ✅ |
| P6 | Alias sync | `vite.config.ts` ↔ `tsconfig.json` `@→src` ✅ |
| P7 | Tokens | 24 colors + 2 shadows; no `bg-[#hex]`, no generic `amber/slate/gray` ✅ |
| P8 | No `any` / `@ts-ignore` / `innerHTML` / `eval` in src ✅ |
| P9 | No secrets / no `.env` in repo ✅ |
| P10 | Data single-source counts | lifeTimeline 8, whatToSee 3, faqs 6, upcomingEvents 4, givingOptions 8, images 10, hours 5, primaryNav 6, footerNav 10 ✅ |
| P11 | Live route sweep | 16 routes + 4 anchors + images + drawer + FAQ → 29/29 ✅ |
| P12 | Hash anchors scroll (603/1275/1947/432 px) ✅ |
| P13 | Mobile drawer open→navigate→close on live ✅ |
| P14 | FAQ single-open accordion on live ✅ |
| P15 | `pnpm audit` residual = 1 low (dev-transitive, deferred) ✅ |
| P16 | CI definition mirrors gate (Node 24, pnpm 11, artifact uploads) ✅ |
| P17 | `src/` file count 38 (32 source + 5 tests + 1 setup) ✅ |
| P18 | SafeImage onError fallback guard intact; CDN→local exercised by e2e route-abort test ✅ |
| P19 | `prefers-reduced-motion` blocks present (base + reveal) ✅ |
| P20 | `pnpm test:coverage` runs (coverage-v8 installed) ✅ |

---

## OWASP 2025 Mapping (static SPA context)

| Rank | Category | Verdict |
|---|---|---|
| A01 Broken Access Control | Pass — no auth surface |
| A02 Security Misconfiguration | **M4** — missing security headers (host + artifact) |
| A03 Supply Chain | Pass w/ deferred L1; pins exact + frozen lockfile |
| A04 Cryptographic Failures | Pass — no secrets/crypto in client |
| A05 Injection | Pass — no eval/innerHTML; external URLs are static constants; **H2** is navigation-safety, not injection |
| A06 Insecure Design | Pass — static SPA per ADR-1..5 |
| A07 Auth Failures | N/A |
| A08 Software/Data Integrity | Pass — lockfiles + tracked artifact inputs; vendored skills pinned in-repo |
| A09 Logging/Alerting | N/A browser SPA |
| A10 Exceptional Conditions | Pass — SafeImage once-guard, Reveal IO fallback, Layout scroll fallback |

---

## Remediation Backlog (executed in this change set unless noted)

| ID | Severity | Status | Fix |
|---|---|---|---|
| H1 | High | **Fixed** | eslint ignores += `skills`; docs state vendored-and-tracked reality |
| H2 | High | **Fixed** (TDD: unit + strengthened E2E regression) | SkipLink `preventDefault` + focus `#main-content`; `<main tabIndex={-1}>` |
| M1 | Medium | **Fixed** | `expect.timeout = 15s` in playwright.config (cold-start headroom) |
| M2 | Medium | **Fixed** (docs) | pnpm documented as required; `npm ci --legacy-peer-deps` caveat |
| M3 | Medium | **Fixed** | Footer socials → verified shrine profiles |
| M4 | Medium | **Artifact-level fixed** | meta CSP + referrer + favicon; host HSTS/XCTO noted for operator |
| M5 | Medium | **Fixed** | Four-doc alignment pass (all drift items) |
| M6 | Medium | **Fixed** (docs) | Audit scoping convention documented |
| L1 | Low | Deferred (upstream) | eslint bump later |
| L2 | Low | **Fixed** | data-URI favicon |
| L3 | Low | **Fixed** | explicit `#root` guard |
| L4 | Low | Backlog | Accordion APG keys |
| L5 | Low | Accepted | editorial eyebrow sizes documented |
| L6 | Low | Accepted | `allowScripts` noted in docs |

**Verification (Iron Law):** post-fix gate re-run fresh — `pnpm lint` 0 · `pnpm typecheck` 0 · `pnpm test` 6 files/29 · `pnpm test:e2e` 20/20 (incl. cold-cache run) · `pnpm build` single-file + `dist/images/` · live sweep re-run clean. See `.audit-report.md` appendix and commit history for raw outputs.
