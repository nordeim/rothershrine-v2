# Codebase Alignment Validation — rothershrine v1.3.0

## Goal
Verify that the codebase on disk matches the documented contracts in `AGENTS.md` / `CLAUDE.md` / `README.md` / `rothershrine-v2_SKILL.md` byte-for-byte, and confirm project status (green gates, deployable artifact, no drift).

## Deep Understanding (Distilled)

**Identity:** Static SPA clone of National Shrine of Blessed Stanley Rother (OKC). Reverent/editorial (Fraunces + Source Sans 3, parchment/maroon/gold), no backend/DB/SSR, deployable as single `dist/index.html` + `dist/images/` to GH Pages/S3 via `HashRouter`.

**Stack (all pinned exact, no `^`):** React 19.2.8, Vite 7.3.6 + @vitejs/plugin-react 5.2.0, Tailwind 4.3.3 + @tailwindcss/vite 4.1.17, TS 5.9.3 strict, React Router 7.18.2 HashRouter, vite-plugin-singlefile 2.3.3, eslint 9.23 flat, vitest 3.1.4 jsdom 26.1.0, testing-library 16.2.0, playwright 1.54.1 chromium. Alias `@→src` synced in vite.config ↔ tsconfig. pnpm 11, Node ≥20.

**Architecture:** `index.html → main.tsx → App.tsx (HashRouter 15 routes: 7 alias pairs + 3 WhatToSee anchors + #visit + *) → Layout (Outlet + double-hash scroll 80ms + SkipLink) → Header(useScrolled(16) default 12) / Pages(10 named exports) / Footer → data(nav,content,site) + utils/cn + ui/* primitives.` No global store, no server.

**Routes:** Canonical + aliases preserved: `/about↔/about-blessed-stanley-rother`, `/what-to-see↔/grounds-art-architecture`, `/pilgrimage↔/visit-planning↔/hours-location`, `/news-events↔/news-and-events`, `/give↔/shrinegift`, plus `#pilgrim-center|#shrine-church|#tepeyac-hill` (WhatToSee) and `#visit` (Pilgrimage) via `<Link to="/what-to-see#id">` (not `<a href="#id">`).

**Data (single source):** `nav.ts` primaryNav 6 (2 with children+description) + footerNav 10; `content.ts` lifeTimeline 8, whatToSee 3 (+imageAlt required), faqs 6, upcomingEvents 4 (+category), givingOptions 8 (+icon), images 10 (Pexels CDN + local fallbacks); `site.ts` hours 5 keys + mass + contact + mapsUrl/embed.

**Design System:** `src/index.css` `@theme` is sole token source (24 colors + 2 shadows, no tailwind.config). Utilities: text-balance, bg-adobe-texture, bg-grain, divider-weave/thin, gold-rule/left, mask-fade-b, reveal/visible, skip-link. Tokens: shrine-cream/parchment(+dark)/stone/ink/charcoal, maroon 50/100/500/600/700/800/900/950, gold 100/300/400/500/600, pine 500/600/700, terracotta 400/500, shadow-shrine/lg. Button variants primary/secondary/ghost/outline-light, Container max-w-7xl, SafeImage fallback guard.

**Quality Gate:** `pnpm lint && pnpm typecheck && pnpm test (26/5) && pnpm test:e2e (20/4 chromium) && pnpm build` → 46 green. CI mirrors it (Node 24, pnpm 11, --frozen-lockfile).

**Quirks preserved:** HashRouter intentional, singlefile inlines JS/CSS not publicDir, alias sync, TS noUnusedLocals/Params, skills symlink ignored + watch ignored, SafeImage onError guard, useScrolled 12 vs 16 intentional, Layout double-hash split, Google Fonts in index.html.

---

## Tasks

- [ ] **T1 — Stack & Lockfile Contract** — `rg -n '"react": "19.2.8"' package.json && rg -n '"\^"' package.json` (expect no `^`) + `pnpm-lock.yaml` committed, `engines node>=20`, `packageManager pnpm@11` → Verify: `package.json` versions match §2 table exactly; `allowScripts` intact
- [ ] **T2 — Config Sync Audit** — Read `vite.config.ts` (plugins order react→tailwindcss→viteSingleFile, alias `@→src`, test globals/jsdom/setupFiles/include/exclude, watch.ignored 5 patterns) + `tsconfig.json` (strict + noUnusedLocals/Params + isolatedModules/noEmit, paths `@/*` + baseUrl `.`, include 4 files, types node+vitest) + `eslint.config.js` (flat ignores 4 dirs) + `playwright.config.ts` (chromium, webServer vite :5173) → Verify: alias synced both files, no drift from docs
- [ ] **T3 — Design Token Audit** — `read src/index.css` + `rg --color shrine- src/index.css -c` (expect 24 colors +2 shadows) + list 11 utilities; compare hex table in README/SKILL §19 byte-for-byte → Verify: no arbitrary `bg-[#...]` in `src/` (`rg "bg-\[#"`), no `tailwind.config.*`
- [ ] **T4 — Routing & Layout Contract** — Read `src/App.tsx` (15 routes + `*` NotFound) + `src/data/nav.ts` (counts) + `src/components/Layout.tsx` (split on `#`, strip `/`, 80ms setTimeout, fallback scrollTo) + `src/pages/WhatToSee.tsx` (Link to `#id` not `<a>`) → Verify: 7 alias pairs present, 4 hash anchors, double-hash scroll works
- [ ] **T5 — Data & Component Inventory** — `fd src --type file | wc -l` (expect 38: 32 source +5 tests+1 setup) + counts: `lifeTimeline 8`, `whatToSee 3`, `faqs 6`, `upcomingEvents 4`, `givingOptions 8`, `hours 5`, `primaryNav 6/footerNav 10`, `public/images` 4 files; verify `SafeImage.tsx` fallback guard + `useScrolled.ts` threshold logic + `Button.tsx` discriminated union + `cn.ts` twMerge(clsx) → Verify: no inline copy, all pages render from data, no bare `<img>` for CDN
- [ ] **T6 — Quality Gates (5-step)** — Run `pnpm lint` → `pnpm typecheck` → `pnpm test` → `pnpm test:e2e` → `pnpm build` + `ls -lh dist/index.html dist/images/` → Verify: 26 unit (5 files) + 20 E2E (4 specs) green, single `dist/index.html` ~370kB gzip ~108kB + dist/images 4 files
- [ ] **T7 — E2E Journey Smoke** — Run `pnpm preview` + manual/agent-browser smoke per Appendix B (12 steps: Home hero, About timeline 8, WhatToSee 3 hashes, Pilgrimage aliases, news alias, give alias 8, FAQ 6, NotFound, hash refresh) + `route.abort("**/pexels.com/**")` SafeImage fallback test → Verify: no 404 on alias/hash, drawer closes, SkipLink focuses
- [ ] **T8 — Docs & CI Alignment** — Diff `README.md` vs `AGENTS.md` vs `CLAUDE.md` vs `rothershrine-v2_SKILL.md` version tables + `rg "1\.3\.0|19\.2\.8|7\.3\.6|4\.3\.3"` + read `.github/workflows/ci.yml` (Node 24, pnpm 11, --frozen-lockfile, lint→typecheck→test→playwright install→test:e2e→build, artifacts) + `.gitignore` (skills/dist ignored) → Verify: all four docs in sync, CI mirrors pre-push gate

## Done When
- [ ] Every doc claim has a file/line or command output proving it (or a drift is logged as issue)
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` all green (46/46) on this checkout
- [ ] Drift report produced: `docs/alignment-report.md` with PASS/DRIFT table + recommended fixes (if any)
- [ ] Version pin table (`package.json` ↔ docs) shown exact, no `^` found

## Notes
- **Verification is LAST** — T6/T7/T8 are the gate; T1–T5 are static reads, T6–T7 are live runs. Do not claim "done" before `pnpm build` + `pnpm preview` smoke.
- Skills symlink `skills → ~/.pi/agent/skills` must stay ignored; `server.watch.ignored` prevents ENOSPC.
- Forbidden tokens: `amber-*`, `slate-*`, `gray-*` generics, `bg-[#...]` arbitrary hex — grep before ship.
- If BrowserRouter temptation appears, require ADR + 404.html shim — out of scope for this audit.
