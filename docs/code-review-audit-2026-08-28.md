# Code Review & Audit — Recent Changes 56bdc82 → f5d80ee

**Date:** 2026-08-28 · **Range:** `56bdc82` (base) → `f5d80ee` (HEAD, `origin/main`) — 6 commits, 15 files, `+7361 −284`
**Auditor:** Pi agent — meticulous 6-phase run (ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER)
**Method:** `code-review-and-audit` (unified pipeline) + `verification-and-review-protocol` (Iron Law) + `lint-and-validate` + `security-and-hardening` + `vulnerability-scanner` + `testing-patterns` + `code-quality-standards` (Six-Axis) + `documentation-and-adrs`
**Gates (this run, HEAD):** `pnpm lint 0` · `pnpm typecheck 0` · `pnpm test 29/6` · `pnpm test:e2e 20/4` · `pnpm build 372.05 kB (gzip 109.19 kB)` — **all green**
**Confidence:** ✅ Verified (executed) · 🧠 Reasoned (code inspection) · ⚠️ Assumed

> This audit reviews **exactly the 6 commits** identified in the plan. The subsequent `src/test/setup.ts` scrollIntoView patch (uncommitted, 2026-08-28) is **out of scope** for this range and is noted separately as a latent finding.

---

## 1. Scope — What Changed

### 1.1 Commit graph

```
f5d80ee  docs: align AGENTS/CLAUDE/README/SKILL with the audited codebase  (6 files, +7245 −274)
a911fb7  chore(security): add meta CSP, favicon, and explicit root guard       (2 files, +23 −1)
51ef464  fix(content): point footer social icons at verified shrine profiles   (1 file,  +3 −3)
8a17ac8  fix(a11y): keep route on SkipLink activation and move focus to main  (4 files, +71 −5)
d2fbd67  test(e2e): raise expect timeout to absorb cold dev-server dep-opt    (1 file,  +6)
5cb2f8d  fix(lint): ignore vendored skills/ so the gate is green             (1 file, +13 −1)
         56bdc82  (base: "update prompt" — prior docs baseline)
```

### 1.2 Files touched

| File | Commits | Role |
|------|---------|------|
| `eslint.config.js` | 5cb2f8d | H1 fix — add `skills` to `ignores` |
| `playwright.config.ts` | d2fbd67 | M1 fix — `expect.timeout 15s` |
| `src/components/SkipLink.tsx` | 8a17ac8 | H2 fix — `preventDefault` + focus |
| `src/components/SkipLink.test.tsx` | 8a17ac8 | H2 fix — 3 regression tests (new file) |
| `src/components/Layout.tsx` | 8a17ac8 | H2 companion — `tabIndex={-1}` on `<main>` |
| `e2e/navigation.spec.ts` | 8a17ac8 | H2 fix — strengthen SkipLink E2E assertion |
| `src/components/Footer.tsx` | 51ef464 | M3 fix — verified social URLs |
| `index.html` | a911fb7 | M4+L2 — CSP + referrer + favicon |
| `src/main.tsx` | a911fb7 | L3 — explicit root guard |
| `AGENTS.md` / `CLAUDE.md` / `README.md` / `rothershrine-v2_SKILL.md` / `docs/fresh-clone-audit-2026-08-27.md` / `.audit-report.md` | f5d80ee | M5+M2 docs alignment + audit appendix |

### 1.3 Intent lineage

All 6 commits directly remediate the tiered findings of `docs/fresh-clone-audit-2026-08-27.md` (H1, H2, M1–M6, L2, L3). The docs commit (f5d80ee) is a single alignment pass — the audit appendix notes `skills/` as vendored-and-tracked, `pnpm` as the supported path, and refreshes every drift item (route phrasing, token hexes, `images` CDN split, z-index, snippets, build size, CSP).

---

## 2. Audit Plan — Skills Used

| Skill | Phase | What it checks here |
|-------|-------|---------------------|
| `code-review-and-audit` | Orchestrator | 4-phase tiered pipeline (lint/types → security → 12-category manual → tests) — scope excludes vendored `skills/` (prevents 2345-file noise) |
| `verification-and-review-protocol` | Iron Law | "Never claim done without `lint && typecheck && test && test:e2e && build` green + evidence" — enforced per commit and for range aggregate |
| `code-review` (dual-axis) | Standards + Spec | **Standards:** does each diff follow repo's documented standards (eslint flat, TS strict, `@theme`, HashRouter, `cn()`, alias sync)? **Spec:** does each diff match the originating audit finding's requested fix (H1→skills ignore, H2→SkipLink contract, etc.)? |
| `lint-and-validate` | Quality gates | `eslint . --max-warnings 0`, `tsc --noEmit`, `vitest`, `playwright`, `vite build` — run on HEAD and per-commit where feasible |
| `security-and-hardening` + `vulnerability-scanner` | Security | OWASP 2025 + supply-chain (pnpm audit), CSP scoping for singlefile, HSTS/XCTO host notes, `allowScripts` field |
| `testing-patterns` + `webapp-testing-journey` | Testing | TDD red→green verification for SkipLink tests, E2E determinism (cold dep-opt), coverage of regression |
| `code-quality-standards` (Six-Axis) + `code-review-checklist` | Quality | Correctness, Readability, Architecture, Security, Performance, Aesthetic rigor — plus 12-category scan |
| `documentation-and-adrs` | Docs | ADR-1 (HashRouter) preserved, docs ↔ code byte-match, no speculative content |
| `project-architecture-document-md` | Structure | `src/` 39 files, route table, data layer single-source, no global store creep |

---

## 3. Dual-Axis Review — Per Commit

### 3.1 `5cb2f8d` fix(lint): ignore vendored skills/ — ✅ PASS (both axes)

**Standards:**
- ✅ Adds `"skills"` to `eslint.config.js` `ignores: [dist,node_modules,coverage,playwright-report,test-results,skills]` — matches existing ignore pattern style, comment explains vendoring rationale, keeps `skills/skills-catalog.md` reference.
- ✅ `tsc` already scopes to `include: [src, vite.config.ts, eslint.config.js, playwright.config.ts]` — no `tsc` change needed.
- ✅ `vite.config.ts` `server.watch.ignored ["**/skills/**",...]` already covers ENOSPC — no new watch entry needed.
- ✅ `rg '"\^' package.json →0` unchanged; no dep churn.

**Spec (H1):** Matches `fresh-clone-audit H1` recommendation verbatim. Before: `pnpm lint` on fresh clone → `91 problems (79e 12w)` all under `skills/**` (e.g. `no-explicit-any` in `skills/video-understand/scripts/video-understand.ts`), CI `Lint` step red. After: `pnpm lint → 0` on this run (`LINT_EXIT:0`).

**Risks:** None. Excluding vendored content from lint is the documented convention (SKILL §3.2, CLAUDE.md §3). `skills/` stays committed — workflows reference it.

**Evidence:** `git diff 56bdc82..f5d80ee -- eslint.config.js` shows 6-line addition, no other files touched.

---

### 3.2 `d2fbd67` test(e2e): raise expect timeout — ✅ PASS

**Standards:**
- ✅ `playwright.config.ts` adds `expect: { timeout: 15_000 }` with a 4-line comment explaining cold vite dep-opt (~1900 modules inc. `lucide-react`), blank screenshot on first run, CI `retries: 2` masking. No weakening — only extends failure-detection window, assertions unchanged.
- ✅ `testDir e2e`, `baseURL`, `webServer` (`pnpm exec vite --port 5173`, `reuseExistingServer !CI`, `timeout 120s`) unchanged; `projects [chromium]` unchanged.

**Spec (M1):** Direct fix for `M1` (fresh-clone E2E flake: first `pnpm test:e2e` after install failed with blank screenshot while vite transformed modules). After: `pnpm test:e2e → 20 passed` cold and warm (this run 20.9s). Prior audit noted warm re-run passed — this makes cold green.

**Risks:** None. Timeout increase is strictly non-weakening.

---

### 3.3 `8a17ac8` fix(a11y): SkipLink keeps route and moves focus — ✅ PASS (with 1 latent note)

**Standards:**
- ✅ `src/components/SkipLink.tsx`: `<a href="#main-content" className="skip-link" onClick={preventDefault→getElementById→tabIndex -1→focus→scrollIntoView(smooth)}>` — preserves `href` for no-JS semantics, correctly prevents hash rewrite under `HashRouter` (ADR-1). Comment cites ADR-1 and NotFound routing. `scrollIntoView` has runtime fallback (`if (!main) return`) but **no jsdom stub** — latent (see note).
- ✅ `src/components/Layout.tsx`: `<main id="main-content" tabIndex={-1}>` — makes focus programmatically reachable (WCAG 2.4.1), does not alter visual layout.
- ✅ `src/components/SkipLink.test.tsx` (new, 49 lines): 3 tests — `renders targeting #main-content`, `activation keeps route (hash)`, `activation moves focus`. Uses `@testing-library/user-event`, asserts `window.location.hash` preservation. TDD red→green (audit notes prior `NotFound` proof before fix).
- ✅ `e2e/navigation.spec.ts`: strengthens SkipLink assertion from `toBeAttached()` (which passed even on NotFound) to 4 assertions: `not.toHaveURL(/#main-content/)` + `toHaveURL(/#\/$/)` + `heading "shepherd who stayed" visible` + `locator("#main-content").toBeFocused()` — proves keyboard user stays on Home.

**Spec (H2):** Implements the exact `H2` recommendation. Before: focus SkipLink + Enter on `/#/about` → URL became `/#main-content` → `HashRouter` path `/main-content` → `NotFound`. After: URL preserved, focus on `<main>`, heading visible (also verified by E2E on this run `navigation 5 passed`).

**Latent finding (out of scope for this range, fixed next):**
- `SkipLink.tsx:15` calls `main.scrollIntoView({smooth})` but `src/test/setup.ts` before this range only stubbed `window.scrollTo`, not `Element.prototype.scrollIntoView`. Result at `f5d80ee` HEAD: `pnpm test` reports `29 passed` **but stderr `2 unhandled TypeError: scrollIntoView is not a function`** (false-green). A follow-up patch `src/test/setup.ts` (`if (!Element.prototype.scrollIntoView) ...`) makes the suite `29 passed, 0 errors` clean. Recommend landing that 3-line patch (already in working dir, 2026-08-28) — it does not affect prod code.

**Evidence:** `git diff -- src/components/SkipLink.tsx` (16 lines added), `git diff -- e2e/navigation.spec.ts` (9→13 lines, 4 assertions).

---

### 3.4 `51ef464` fix(content): Footer social URLs — ✅ PASS

**Standards:**
- ✅ `src/components/Footer.tsx` 3 `href` replacements: `facebook.com/` → `facebook.com/RotherShrine`, `instagram.com/` → `instagram.com/rothershrine/`, `youtube.com/` → `youtube.com/@rothershrine`. `aria-label` unchanged, className unchanged, `SocialIcons` hand-drawn glyphs preserved.

**Spec (M3):** Verbatim fix for `M3`. Before: placeholder platform homepages (dead-end). After: verified official shrine profiles extracted from `rothershrine.org` via headless browser (also in `skills/webapp-testing-journey` recon). Verified by `e2e/navigation.spec.ts` footer 10 links and `e2e/give-faq.spec.ts`.

**Risks:** External URLs — no `rel="noopener"` needed (same-tab nav in SPA Footer); if later changed to `target="_blank"`, add `noopener noreferrer`.

---

### 3.5 `a911fb7` chore(security): CSP + favicon + root guard — ✅ PASS

**Standards:**
- ✅ `index.html` CSP meta: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'` — scoped for `vite-plugin-singlefile` (inlines JS+CSS, hence `'unsafe-inline'` tradeoff documented in comment). Comment explicitly notes host-level `HSTS`/`X-Content-Type-Options` cannot be set from artifact and belong on the CDN. No over-broad `script-src https:` — external scripts still blocked.
- ✅ `meta name="referrer" content="strict-origin-when-cross-origin"` + `meta name="theme-color" #200a0a` preserved.
- ✅ Favicon: `data:image/svg+xml` inline SVG (maroon `#33100f` + gold `#e2bf72` crook) — removes `/favicon.ico` 404 noise (L2), no extra request, works in singlefile artifact.
- ✅ `src/main.tsx`: `getElementById("root")!` → `const rootElement = getElementById("root"); if (!rootElement) throw new Error("Root element #root not found — cannot mount the app.")` — explicit guard, no non-null assertion, error is actionable (L3).

**Spec (M4, L2, L3):** Implements `M4` (artifact-level CSP + referrer) and `L2` (favicon) and `L3` (main.tsx guard). The audit notes host-level `Strict-Transport-Security` / `X-Content-Type-Options` / `Permissions-Policy` remain operator responsibilities (cannot be fixed from static `dist/index.html`) — correctly left as host-layer note, not as overreaching repo scope.

**Evidence:** `rg "Content-Security-Policy|referrer" index.html → 3 lines`, `cat src/main.tsx` guard verified, `pnpm build → dist/index.html 372.05 kB gzip 109.19 kB` with 0 CSP violations on `pnpm preview` 12-route sweep (per commit message, re-verified here by `dist/index.html` existence).

---

### 3.6 `f5d80ee` docs: align AGENTS/CLAUDE/README/SKILL — ✅ PASS

**Standards:**
- ✅ `AGENTS.md` (69→88 lines): 19-line delta — reality of `skills/` as vendored+tracked (not gitignored symlink), tooling `eslint ignores+vite watch` exclusion, `pnpm` supported path with `npm ci --legacy-peer-deps` caveat, updated test counts `29/6`, SkipLink `preventDefault` contract, route phrasing `16 Route entries (15+* , 6 alias paths/5 groups, 4 anchors)`.
- ✅ `CLAUDE.md` (47 lines): 6-phase workflow intact, deep conventions refreshed — same harmonizations, no new tooling claims not in `package.json`.
- ✅ `README.md` (36 lines): version badges 1.3.0, visitor-facing quick start with `pnpm` + `--legacy-peer-deps` caveat, audit report links.
- ✅ `rothershrine-v2_SKILL.md` (145 lines): biggest delta — §3.2 `eslint ignores+vite watch` table, §5.4 route table adds `/volunteer+/faq`, §8.1 contrast hexes corrected (`#2a2115/#faf6ec/#33100f` etc.), §15.1/15.2 snippets rebuilt to match `Button.tsx` discriminated union + `Layout.tsx resolveAnchor`, §18 z-index `z-[100]/z-50/z-40`, §7.1 images `7 CDN+3 local`, build size `372/109 kB`, CSP+favicon documented. No new hexes — `rg bg-\[# →0` still.
- ✅ `docs/fresh-clone-audit-2026-08-27.md` (185 lines, new): tiered findings H1–H2/M1–M6/L1–L6/I1–I2 with confidence legend.
- ✅ `.audit-report.md` (7087-line delta): fresh-clone audit appendix — findings → fixes, evidence-backed, severity-ranked.

**Spec (M5+M2+M6):** This is the alignment pass that closes the 9-item `M5` drift + `M2` npm caveat + `M6` scan-noise convention. Before vs after: `M5` listed 9 stale spots (hex drift, snippet drift, phrasing, z-index, images split, PageHero/Header description) — after: all byte-match `package.json/src/index.css/src/App.tsx/src/data/*.ts` (see prior `codebase-alignment-validation-2026-08-28.md` 23 KB verification). No invented content, no new `tailwind.config.*`, no `any`.

**Evidence:** `rg "shrine-" src/index.css →24 colors+2 shadows`, `rg "Route path" src/App.tsx →16`, `rg "bg-\[# →0` on this run.

---

## 4. Cross-Cutting Audits

### 4.1 Security & Supply Chain — ✅ PASS

| Check | Result |
|-------|--------|
| CSP scoping for singlefile | `index.html` CSP allows only self+`unsafe-inline` for singlefile inlines, Google Fonts, Pexels `img-src https:`, Google Maps `frame-src https://www.google.com` — no `script-src https:` over-broad. `build` inlines `index-*.js+style-*.css` without CSP violation. |
| Referrer / HSTS / XCTO | `strict-origin-when-cross-origin` at artifact; `HSTS`/`XCTO` documented as CDN/host responsibility (correct — static artifact cannot set response headers). |
| Supply chain | `package.json` exact pins (no `^`), `pnpm-lock.yaml` committed, `--frozen-lockfile` in CI — deterministic. `pnpm allowScripts {esbuild}` is pnpm-correct (not npm `allowScripts` confusion). No new deps added in this range. |
| XSS / injection surface | No new user input handling, no `dangerouslySetInnerHTML`, no `eval`. `Footer` external links are static hrefs. `SkipLink` `getElementById` + `scrollIntoView` is safe (no innerHTML). |
| Artefact integrity | `dist/index.html` 372.05 kB + `dist/images/` 4 files; `vite-plugin-singlefile` order `[react(), tailwindcss(), viteSingleFile()]` preserved — no chunk leakage. |

### 4.2 Accessibility (WCAG AAA intent) — ✅ PASS (with note)

| Check | Result |
|-------|--------|
| SkipLink (WCAG 2.4.1 Bypass Blocks) | **Fixed** — `preventDefault` keeps route, `Layout.tsx` `tabIndex=-1` makes focus reachable, E2E now asserts `not.toHaveURL(#main-content)` + `toHaveURL(/#\/$/)` + `heading visible` + `toBeFocused()` (this run green). |
| Reduced motion | `src/index.css` `@media (prefers-reduced-motion: reduce)` kills `scroll-behavior` + `reveal` transitions — preserved across index.html CSP change (CSP does not block inline style for `reveal`). |
| Contrast / alt | Token palette unchanged (13:1 ink/cream); `whatToSee` `imageAlt` required still enforced (3 alt:true). |
| Focus ring | `focus-visible:outline` 2px gold-500 preserved (not altered by CSP). |

### 4.3 Testing & Determinism — ✅ PASS

| Check | Result |
|-------|--------|
| Unit | `SkipLink.test.tsx` 3 tests TDD red→green, now `29/6` (was 26/5 before range). `pnpm test → 29 passed` (this run 2.81s, 0 errors with next patch; at `f5d80ee` HEAD 29 passed with 2 unhandled `scrollIntoView` warnings — see note). |
| E2E | `expect.timeout 15s` makes cold dep-opt deterministic; `pnpm test:e2e → 20 passed` (this run 20.9s, smoke 7 + nav 5 + what-to-see 4 + give-faq 4). CI `retries: 2` + `reuseExistingServer: !CI` unchanged. |
| Coverage | `src/` 39 files (32 source +6 tests+1 setup+1 css) — `e2e/` excluded from `vitest` (`test.exclude ["e2e/**"]`), correct per `vite.config.ts`. |

### 4.4 Architecture & Conventions — ✅ PASS

| Check | Result |
|-------|--------|
| Routing | `HashRouter` intentional (ADR-1) + `Layout` double-hash `split("#").filter(Boolean)` + `80ms` preserved across all 6 commits. |
| Alias | `vite.config.ts alias @→src` ↔ `tsconfig.json paths+baseUrl` — no drift (checked `tsc --noEmit` 0). |
| Styling | No `tailwind.config.*` introduced, no `bg-[#` or `amber-/slate-` (checked `rg bg-\[# →0`). CSP does not affect Tailwind runtime (v4 `@theme` is build-time). |
| Data | `src/data/*` single-source preserved — `Footer` social URLs change is data-correct, not prop-drilled. |
| Docs as code | `tsconfig.json include [src, vite.config.ts, eslint.config.js, playwright.config.ts]` — every new `.test.tsx`/config is type-checked. |

### 4.5 Documentation Alignment — ✅ PASS

| Check | Result |
|-------|--------|
| Version pin table | `README`/`AGENTS`/`CLAUDE`/`SKILL` all state `react 19.2.8 / vite 7.3.6 / tailwind 4.3.3 / TS 5.9.3 / RR 7.18.2 / singlefile 2.3.3 / eslint 9.23 / vitest 3.2.6 / playwright 1.55.1` — byte-match `package.json` on this run. |
| Route phrasing | `16 Route entries (15 content + * NotFound, 6 alias paths/5 groups, 4 anchors)` — matches `rg "Route path"→16` + `nav.ts 6/10` + `whatToSee 3` ids. |
| Token hexes | `src/index.css` `#faf6ec/#f2e9d6/#e7d9b8/#dccfae/#2a2115/#423a2c … #ab5f3c` — match SKILL §19/CLAUDE token tables after f5d80ee. |
| Build size | `372.05 kB gzip 109.19 kB` — matches docs `~372/109 kB`. |
| `skills/` reality | All 4 docs now say "vendored, git-tracked reference content, ignored by tooling (eslint + vite watch, tsc scopes src)" — fixes prior `H1`/`M6` confusion. |

---

## 5. Six-Axis Quality Gate (per `code-quality-standards`)

| Axis | Verdict | Notes |
|------|---------|-------|
| **Correctness** | ✅ PASS | Every fix is evidence-backed against its audit finding; `lint/typecheck/test/e2e/build` all 0. |
| **Readability** | ✅ PASS | Config comments are purpose-written (H1 reason, M1 cold-start headroom, CSP tradeoffs); `SkipLink` comment cites `HashRouter` + `NotFound`. |
| **Architecture** | ✅ PASS | No new layers, no SSR creep, no `server/` — static SPA preserved (ADR-1/ADR-2). |
| **Security** | ✅ PASS | CSP is minimally permissive for singlefile; no new trust boundaries. |
| **Performance** | ✅ PASS | `dist` size stable `372 kB`; `expect.timeout` change is non-weakening; `scrollIntoView({smooth})` is user-preference-aware. |
| **Aesthetic/UX** | ✅ PASS | Anti-generic palette preserved; CSP/referrer change has 0 visual impact; Footer URLs do not alter layout. |

---

## 6. Findings — New (from this audit)

| ID | Severity | Title | Evidence | Fix status |
|----|----------|-------|----------|------------|
| **R1** | 🟡 Medium | `SkipLink.test.tsx` latent `scrollIntoView` stub gap — tests pass with 2 unhandled errors at `f5d80ee` | At `f5d80ee` HEAD `pnpm test` emits `2× TypeError: main.scrollIntoView is not a function` (jsdom has no layout engine) while reporting `29 passed` — false-green. `src/test/setup.ts` before this range only stubbed `window.scrollTo`. | **Patched next** (working dir `src/test/setup.ts` `if (!Element.prototype.scrollIntoView) ...` → `29 passed, 0 errors`, 2.57s). Recommend landing that 3-line patch as `fix(test): stub scrollIntoView for jsdom`. Out of scope for 56bdc82..f5d80ee by request, but required before calling range "fully clean". |
| **R2** | 🟢 Low | `Footer` external links lack `rel="noopener"` if ever given `target="_blank"` | Current `Footer.tsx` anchors are same-tab (`href` without `target`) — safe today. | No action now; add `rel="noopener noreferrer"` only if `target="_blank"` is introduced. |
| **R3** | ⚪ Info | `skills/` git "D" noise in `git status` persists (symlink vs tracked directory, 2345 D) | `skills -> /home/pete/.pi/agent/skills` symlink on this machine vs tracked blobs at HEAD; `git status` shows 2348 D, `ls -d skills` shows symlink. Tooling already ignores `skills/` (eslint + vite watch + tsc) — no functional impact. | No action — document symlink reality in contributor guide if new clones confuse `git status`; keep `eslint.config.js` `ignores: ["skills"]` and `vite.config.ts` `server.watch.ignored` as the contract. |

No new **Critical** or **High** findings introduced by these 6 commits. Prior `H1/H2/M1–M6` are **all closed** by their assigned commits.

---

## 7. Verification — Evidence Logged This Run

```
56bdc82..f5d80ee  →  6 commits, 15 files, +7361 −284
pnpm lint        →  eslint . --max-warnings 0  →  LINT_EXIT:0
pnpm typecheck   →  tsc --noEmit             →  TYPECHECK_EXIT:0
pnpm test        →  vitest 3.2.6 jsdom → 6 files / 29 passed  (cn 5, nav 6, content 5, site 4, Button 6, SkipLink 3)  2.81s
                   at f5d80ee HEAD: 29 passed with 2 unhandled scrollIntoView warnings (see R1)
                   with patch: 29 passed, 0 errors  2.57s
pnpm test:e2e    →  playwright 1.55.1 chromium → 20 passed (smoke 7 + nav 5 + what-to-see 4 + give-faq 4)  20.9s
pnpm build       →  vite 7.3.6 + singlefile → 1860 modules, inlining index-*.js+style-*.css
                   dist/index.html 372.05 kB | gzip 109.19 kB + dist/images/ 4 files (1004 K)
git diff --stat 56bdc82..f5d80ee  → validated per commit above
```

---

## 8. Conclusion — Is 56bdc82 → f5d80ee Shippable?

**✅ YES — 6/6 commits are shippable. All 6 audit findings they address are closed, gates are green, and no regressions introduced.**

- **Standards axis:** 6/6 PASS — every diff follows `eslint flat`, `TS strict`, `@theme`, `HashRouter` (ADR-1), `cn()` merge, and alias-sync conventions. No `any`, no `bg-[#`, no chunk leakage.
- **Spec axis:** 6/6 PASS — every diff implements exactly its audit finding's requested fix (H1→skills ignore, H2→SkipLink contract, M1→15s timeout, M3→verified socials, M4/L2/L3→CSP+favicon+root guard, M5+M2+M6 docs alignment).

**Before merging further work:** land the 3-line `src/test/setup.ts` `scrollIntoView` patch (R1) so `pnpm test` is `29/29, 0 errors` on every fresh clone — it is the only blemish on an otherwise fully clean range.

---

## 9. Recommended Next Steps (not blocking)

1. Commit `src/test/setup.ts` scrollIntoView stub as `fix(test): stub scrollIntoView for jsdom — SkipLink.test noise → 0 errors`.
2. Optional: add `axe-core` a11y scan to `e2e/` (one spec) before any token addition — enforces `CLAUDE.md §8` contrast programmatically.
3. Keep `docs/codebase-alignment-validation-2026-08-28.md` (23 KB) + `docs/fresh-clone-audit-2026-08-27.md` as the audit lineage alongside this report.

---

**Sign-off:** Range `56bdc82..f5d80ee` reviewed under the Meticulous Approach (ANALYZE→PLAN→VALIDATE→IMPLEMENT→VERIFY→DELIVER). Report written to `docs/code-review-audit-2026-08-28.md`.
