Deep Understanding & Validation Plan — rothershrine-v2 
 
│ Read: AGENTS.md (60-sec cheat), CLAUDE.md (21 KB authoritative), README.md (visitor + file hierarchy + verify setup), rothershrine-v2_SKILL.md (931-line distillate, v1.3.0 — note: repo has 
│ rothershrine-v2_SKILL.md, not rothershrine_SKILL.md as typed), docs/design_review.md (18 KB, two concatenated audits). 
 
──────────────────────────────────────────────────────────────────────────────── 
 
1 — Deep Understanding (ALIGNMENT CHECK) 
 
### Project Identity 
 
Reverent, not austere clone of rothershrine.org (https://www.rothershrine.org/) — National Shrine of Blessed Stanley Rother, OKC. Story: Oklahoma farm boy → Tz'utujil missionary in Santiago Atitlán → martyred  
1981-07-28 → beatified 2017-09-23 → tells + guides pilgrims through Pilgrim Center / Shrine Church & Tomb Chapel / Tepeyac Hill. Private — all rights reserved. 
 
### Non-Negotiable Constraints (would break if guessed wrong) 
 
┌────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ Constraint             │ Contract                                                                                                                                                                             │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ Static SPA only        │ No SSR, no API, no DB. Ships dist/index.html + dist/images/ via vite-plugin-singlefile 2.3.3 to GH Pages/S3.                                                                         │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ HashRouter is          │ App.tsx HashRouter avoids static-host 404s. Double-hash /#/what-to-see#pilgrim-center handled by Layout.tsx (split('#'), strip '/', 80ms timeout + window.scrollTo fallback).        │ 
│ intentional            │                                                                                                                                                                                      │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ 16 routes, 10 pages    │ App.tsx is sole route table: canonical + 6 aliases in 5 groups (about↔about-blessed-stanley-rother, what-to-see↔grounds-art-architecture, pilgrimage↔visit-planning↔hours-location,  │ 
│                        │ news-events↔news-and-events, give↔shrinegift) + 4 hash anchors + * → NotFound.                                                                                                       │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ Data is file-backed    │ src/data/nav.ts (primaryNav 6 / footerNav 10 — single source) + src/data/content.ts (5 typed arrays + images object with Pexels CDN + local fallback) + src/data/site.ts (canonical  │ 
│                        │ hours 5 keys grounds/shrineChurch/chapelOfTomb/giftShop/museum + mass + contact). Pages render from data, never inline copy.                                                         │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ Tokens are CSS-first   │ No tailwind.config.*. 24 colors + 2 shadows live only in src/index.css @theme (shrine-cream/parchment/stone/ink/maroon-50..950/gold-100..600/pine/terracotta/shadow-shrine).         │ 
│                        │ Arbitrary bg-[#...] is drift.                                                                                                                                                        │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ Alias @ is a two-file  │ vite.config.ts path.resolve(__dirname,"src") ↔ tsconfig.json paths @/* / baseUrl ".".                                                                                                │ 
│ contract               │                                                                                                                                                                                      │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ Strict TS              │ strict + noUnusedLocals/noUnusedParameters/noFallthroughCasesInSwitch/isolatedModules/noEmit — unused code fails.                                                                    │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ skills/ is vendored,   │ eslint.config.js ignores + vite.config.ts server.watch.ignored (skills/**, dist/**, playwright-report/**, test-results/**, coverage/**) prevents ENOSPC. Never import from it.       │ 
│ tracked                │                                                                                                                                                                                      │ 
├────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ SafeImage + SkipLink   │ Pexels CDN → /images/hero-shrine.jpg onError dataset.fallback guard (once) + loading="lazy"; SkipLink preventDefault + imperative focus on #main-content (native jump would rewrite  │ 
│ invariants             │ hash → NotFound). Both have contract tests.                                                                                                                                          │ 
└────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
 
### Stack (all pinned exact, pnpm 11, engines node>=20) 
 
React 19.2.8 + Vite 7.3.6 + @vitejs/plugin-react 5.2.0 + Tailwind 4.3.3 (@tailwindcss/vite 4.1.17) + TS 5.9.3 + react-router 7.18.2 + vite-plugin-singlefile 2.3.3 + tailwind-merge 3.6.0 + clsx 2.1.1 + 
lucide-react 1.34.0 + eslint 9.39.5 flat (typescript-eslint 8.28.0 + eslint-plugin-react-hooks 5.2.0) + vitest 3.2.6 (jsdom 26.1.0) + playwright 1.55.1 chromium + Google Fonts Fraunces + Source Sans 3 in 
index.html. 
 
### Component Architecture

``` 
  index.html → main.tsx (StrictMode) → App.tsx (HashRouter 16 routes → Layout outlet) 
    → Header (fixed z-50, useScrolled(16) default 12, hover+click dropdown, mobile drawer) 
    → PageHero (maroon-950, bg-grain, dual gradient, divider-weave-thin, image alt="") 
    → Pages (10 named exports) → ui/{Button(discriminated to/href/button, 4 variants), Container, SectionHeading(eyebrow+gold-rule-left), Reveal(IntersectionObserver 0.15), Accordion(single-open)} 
    → Footer (4-col, divider-weave-thin, SocialIcons hand-drawn) — all via cn() + shrine-* tokens 
``` 
 
Utilities: text-balance, bg-adobe-texture, bg-grain, divider-weave(-thin), gold-rule(-left), mask-fade-b, reveal/reveal-visible, skip-link + useScrolled hook + cn (twMerge(clsx)). 
 
### Pre-Push Gate (CI mirrors it — Node 24, pnpm 11, 15 min timeout) 
 
pnpm lint && pnpm typecheck && pnpm test (29/6 files) && pnpm test:e2e (20/4 specs) && pnpm build → dist/index.html ~372 kB (gzip ~109 kB) 
 
──────────────────────────────────────────────────────────────────────────────── 
 
2 — docs/design_review.md Deconstruction 
 
The file is two audits concatenated — must be validated separately: 
 
Audit A — "v1 → v2 Maturation" (comparative, 3 shifts: texture/depth, interaction resilience, engineering discipline) 
- Claims maroon-950, bg-grain/adobe-texture/divider-weave, gold-rule, Left Rail timeline (not alternating), explicit z-[100]/50/40 map. 
- Claims SkipLink fix (hash trap → preventDefault + imperative focus), SafeImage (lazy + fallback + onError once), dropdown hover+click, useScrolled(16) intentional mismatch. 
- Findings carried forward: L4 Accordion no Arrow/Home/End (Medium, deferred/backlog), L5 text-[11px] 5 hits accepted (Low), R2 target=_blank 0 hits (Info). 
 
Audit B — "Mode C" (10 findings, severity-ranked) 
- Critical/High a11y: B1 Mobile drawer no focus trap + no aria-modal, B2 Desktop dropdown keyboard-inaccessible (onMouseEnter/Leave only), B3 Accordion no WAI-ARIA arrow navigation. 
- Medium aesthetic: B4 Static hero (no zoom/parallax), B5 Grain lacks mix-blend-mode, B6 Static gold-rule dividers. 
- Low motion: B7 SafeImage no fade-in onLoad, B8 Reveal uses generic ease, B9 Buttons only transition-colors, B10 Quick Facts band not staggered. 
 
Confidence signal: Audit A findings mostly Verified; Audit B mixes Verified (B1–B3, B7) and Reasoned (B4–B6, B8–B10). Verification must separate code-provable vs. aesthetic judgment. 
 
──────────────────────────────────────────────────────────────────────────────── 
 
3 — Validation Plan (6-Phase Gate: PLAN → VALIDATE before any code) 
 
### Phase 1 — ANALYZE (read-only, no edits) 
 
Goal: Prove each claim against byte-for-byte source. 
 
┌────────┬────────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ #      │ Claim → Evidence to pull                                       │ File + exact probe                                                                                                                  │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A1     │ maroon-950 #200a0a exists                                      │ rg "maroon-950" src/index.css + hex check vs. SKILL §19                                                                             │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A2     │ bg-grain/bg-adobe-texture/divider-weave(-thin)/gold-rule(-left │ read src/index.css @layer utilities block                                                                                           │ 
│        │ ) utilities                                                    │                                                                                                                                     │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A3     │ Timeline is Left Rail                                          │ read src/components/Timeline.tsx — check border-l vs alternating                                                                    │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A4     │ z-[100]/50/40 map                                              │ rg "z-\[" src/components/{Header,SkipLink} src/pages/WhatToSee                                                                      │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A5     │ SkipLink preventDefault + tabIndex={-1}                        │ read src/components/SkipLink.tsx + src/components/Layout.tsx #main-content + src/components/SkipLink.test.tsx                       │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A6     │ SafeImage fallback once + lazy                                 │ read src/components/SafeImage.tsx (dataset.fallback, fallback="/images/hero-shrine.jpg") + e2e/what-to-see.spec.ts                  │ 
│        │                                                                │ route.abort("**/pexels.com/**")                                                                                                     │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ A7     │ Dropdown hover+click + useScrolled(16)                         │ read src/components/Header.tsx (onMouseEnter/Leave + onClick + openDesktopMenu) + read src/hooks/useScrolled.ts default 12          │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ B1     │ Drawer focus trap missing                                      │ read src/components/Header.tsx ~165-185: aria-modal, trap logic, body scroll lock                                                   │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ B2     │ Desktop dropdown keyboard                                      │ Same — check onFocus/onBlur + focus-within vs hover-only                                                                            │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ B3/B7  │ Accordion arrow keys / motion                                  │ read src/components/ui/Accordion.tsx (onKeyDown), src/index.css .reveal easing                                                      │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ B4–B6  │ Hero static, grain blend, gold-rule                            │ read src/pages/Home.tsx hero scale-105, read src/index.css .bg-grain blend, read src/components/ui/SectionHeading.tsx gold-rule     │ 
├────────┼────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ B7–B10 │ SafeImage fade, easing, buttons, facts stagger                 │ read src/components/SafeImage.tsx onLoad, src/index.css transition: opacity 0.7s ease, src/components/ui/Button.tsx                 │ 
│        │                                                                │ transition-colors, src/pages/Home.tsx facts band Reveal                                                                             │ 
└────────┴────────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
 
Also: rg "text-\[11px\]" src/ (5 hits expected), rg "target=.blank" src/ (0 expected), rg "shrine-" src/index.css count = 26 theme entries, rg "bg-\[#" src/ (drift check), pnpm test / pnpm lint for regression. 
 
### Phase 2 — Validate Against Architecture Contracts 
 
Cross-check every finding against AGENTS.md Quirks, CLAUDE.md §8 A11y, SKILL §§4–8,11: e.g., B1/B2 severity is High because CLAUDE.md:8.2 already mandates aria-expanded/SkipLink but leaves drawer trap + 
dropdown focus as gap; B3 aligns with existing audit backlog L4 Accordion (deferred). 
 
### Phase 3 — Live Verification (optional, after source audit) 
 
pnpm build && pnpm preview + agent-browser sweep: Home hero → facts band → grounds cards → WhatToSee 3 anchors + jump nav Link to="/what-to-see#id" (not <a>), mobile drawer open→navigate→close, FAQ 
single-open, keyboard Tab through header dropdown, SkipLink focus, prefers-reduced-motion check. 
 
### Phase 4 — Findings Ledger (deliverable: docs/design-review-validation-YYYY-MM-DD.md) 
 
Table per finding: Claim | Code Location | Method (rg/read/test/e2e/browser) | Aligned? (YES / PARTIAL / NO / REASONED-JUDGMENT) | Evidence snippet | Severity if gap | Recommendation. 
 
### Phase 5 — Triage & Sequencing (no code yet) 
 
Rank validated gaps: P0 a11y traps (B1, B2) → P1 WAI-ARIA (B3/A L4) → P2 resilience polish (B7, B4, B9) → P3 editorial texture (B5, B6, B8, B10) → map to existing backlog (docs/code-review-audit-*.md, 
fresh-clone-audit). 
 
──────────────────────────────────────────────────────────────────────────────── 
 
### Success Criteria (gate before remediation) 
 
- [ ] Every design_review.md claim mapped to exact file:line + rg/read output. 
- [ ] Ledger distinguishes Verified code gaps vs. Reasoned aesthetic suggestions (no false severity inflation). 
- [ ] No new code, no doc edits — pure read + ledger.
- [ ] You approve ledger before any remediation plan is drafted. 
 
### Effort & Sequencing 
 
- Analyze (source probes): ~20 min read-only 
- Ledger write: ~15 min 
- Live sweep (if requested): ~15 min additional 
 
──────────────────────────────────────────────────────────────────────────────── 
 
Next decision — pick one: 
 
Shall I proceed to execute this validation plan read-only (probe the 11 files + rg checks and produce docs/design-review-validation-*.md with the evidence ledger), or do you want to adjust scope first (e.g.,   
skip live browser sweep, or include the full fresh-clone-audit remediation cross-check)?

---

Validation complete — read-only, no code changed. 
 
Artifact: docs/design-review-validation-2026-08-28.md 
 
TL;DR — design_review.md is HIGH fidelity (no hallucinations), with two soft corrections: 
 
- Audit A (v1→v2 maturity): 8/8 claims verified — maroon-950, bg-grain/adobe/divider-weave, gold-rule, Left Rail timeline, z-[100]/50/40, SkipLink hash-trap fix, SafeImage fallback, hover+click + 
  useScrolled(16) all byte-for-byte correct. 
- Carried forward: L4/B3 accordion gap verified, R2 target=_blank 0 verified, L5 text-[11px] count is 6 not 5 (adds NewsEvents.tsx:33 — doc scope says Header/Home only, Low severity, correct with note). 
- Mode C B1–B10: 10/10 verified — B1 drawer focus trap missing (High, no aria-modal/trap, only body scroll lock) and B2 desktop dropdown keyboard (High, onMouseEnter/Leave + onClick exists but no 
  onFocus/onBlur/focus-within → WCAG 2.1.1/2.4.3) are ship-blocking; B3 accordion arrows (Medium) duplicates L4; B7 pop-in (Medium) no onLoad; B4–B6, B8–B10 are reasoned aesthetic polish (observed, not 
  defects). 
- Doc contradiction: Two executive summaries pasted together give opposing verdicts (A: "production-ready" / B: "critical gaps prevent true avant-garde status") — consolidated verdict + P0→P3 sequencing is in  
  the ledger. 
 
Gate check: pnpm lint 0 + pnpm typecheck 0 re-verified. 
 
Pick next — I won't edit until you choose: 
- (A) ledger stands, await "go P0/P1/P2/P3", or 
- (B) execute P0+P1 a11y fixes TDD (Header drawer trap + keyboard dropdown + Accordion arrows), or 
- (C) full P0→P3 B1→B10 in one TDD run with browser sweep.

---

All 10 findings remediated — TDD, gates green. 
 
Fixes (P0→P3 sequential, no SSR/API drift): 
 
┌──────────┬────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
│ Priority │ Finding                │ Fix                                                                                                                                  │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P0       │ B1 Drawer trap         │ Header.tsx → role=dialog + aria-modal="true" + drawerRef + Tab/Shift+Tab wrap + Escape close + focus first on open                   │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P0       │ B2 Dropdown keyboard   │ Header.tsx → onFocusCapture open + onBlurCapture close (contains check) + Escape listener; aria-haspopup/expanded preserved          │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P1       │ B3/L4 Accordion arrows │ Accordion.tsx → container onKeyDown → ArrowDown/Up wrap + Home/End + new Accordion.test.tsx 4 tests                                  │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P2       │ B7 Pop-in              │ SafeImage.tsx → loaded state + transition-opacity 500ms ease-out opacity-0→100 + onLoad + fallback sync + SafeImage.test.tsx 3 tests │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P2       │ B8 Easing              │ index.css .reveal → cubic-bezier(0.22,1,0.36,1)                                                                                      │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P3       │ B9 Button lift         │ Button.tsx → transition-all 300ms hover:-translate-y-0.5 hover:shadow-shrine                                                         │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P3       │ B10 Facts stagger      │ Home.tsx → facts wrapped in Reveal delay={index*80}                                                                                  │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P3       │ B4 Hero zoom           │ index.css @keyframes hero-ken-burns 20s + Home.tsx hero-ken-burns replaces static scale-105                                          │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P3       │ B6 Gold-rule draw      │ index.css @keyframes gold-rule-draw scaleX(0→1) 0.9s on both .gold-rule variants                                                     │ 
├──────────┼────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
│ P3       │ B5 Grain               │ index.css .bg-grain → mix-blend-mode: multiply                                                                                       │ 
└──────────┴────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ 
 
Artifacts: 
- docs/design-review-validation-2026-08-28.md — 18-claim ledger (8/8 Verified, B1/B2 High gaps confirmed) 
- docs/design-review-remediation-2026-08-28.md — this run (table + test evidence) 
 
Gates (post-fix): lint 0 · typecheck 0 · test 36/8 files (+7: Accordion 4 + SafeImage 3) · test:e2e 20/20 chromium · build 376.73 kB gzip 110.37 kB (+4KB) 
 
No any, no bg-[#, no tailwind.config.* — shrine-* + cn() discipline held. All motion gated by existing prefers-reduced-motion kill.

