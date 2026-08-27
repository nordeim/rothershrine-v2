Deep understanding — complete. Gates re-verified read-only. Plan below awaits your gate before any edits. 
 
### 1 — Deep Understanding (verified byte-for-byte) 
 
Identity — reverent not austere: rothershrine.org clone (OKC, farm boy → Tz'utujil/Santiago Atitlán → martyred 1981-07-28 → beatified 2017-09-23). 3 sites: Pilgrim Center / Shrine Church & Tomb / Tepeyac Hill. 
Private, static SPA. 
 
Non-negotiable contracts (would break if guessed wrong): 
- HashRouter in App.tsx — 16 Route (15 content + * NotFound), 6 legacy aliases in 5 groups + 4 hash anchors (#pilgrim-center #shrine-church #tepeyac-hill #visit), double-hash aware Layout.tsx:80ms + scrollTo   
  fallback • viteSingleFile 2.3.3 inlines JS+CSS, public/images/→dist/images/ copied, no dynamic import() chunks • @ alias two-file contract vite.config.ts↔tsconfig.json • Tailwind v4 CSS-first @theme only 
  (src/index.css 24 colors +2 shadows, token shrine-* only, no bg-[#, no tailwind.config.*) • TS strict noUnusedLocals/Params/isolatedModules/noEmit • skills/ vendored tracked, ignored by 
  eslint+server.watch.ignored • SafeImage fallback="/images/hero-shrine.jpg" lazy dataset.fallback=1 once + SkipLink preventDefault→focus #main-content (native jump rewrites hash → NotFound under HashRouter) • 
  useScrolled(16) vs default 12 intentional. 
 
Stack pinned exact: react 19.2.8 vite 7.3.6 tailwind 4.3.3/@vite 4.1.17 TS 5.9.3 react-router 7.18.2 HashRouter singlefile 2.3.3 eslint 9.39.5 flat vitest 3.2.6 jsdom playwright 1.55.1 chromium pnpm 11 engines 
node>=20 Fraunces+Source Sans 3 in index.html. 
 
Pre-push gate (CI Node 24 mirrors): pnpm lint 0 && pnpm typecheck 0 && pnpm test 29→36 && pnpm test:e2e 20 && pnpm build → dist/index.html ~372→376.73kB — just re-probed: all 5 green (lint 0, typecheck 0, test 
36/8 files, e2e 20/20 23s, build 376.73kB gzip 110.37kB). 
 
Source lineage: AGENTS.md (60s cheat) → CLAUDE.md (21KB authoritative, 6-phase Meticulous) → README.md (visitor+verify setup) → rothershrine-v2_SKILL.md v1.3.0 931-line distillate — shall use the -v2_ file, 
not rothershrine_SKILL.md as typed. 
 
---
 
### 2 — Plan to review the 3 remediation docs 
 
┌────────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────┐ 
│ Doc                                │ Bytes                                    │ What to prove                                    │ Probe                                                                      │ 
├────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────┤ 
│ docs/design-review-remediation-202 │ B1→B10 P0→P3 table + per-fix             │ Every File:line maps to git show HEAD -- <file>  │ read doc table → git show HEAD --stat (14 files, +997/-16) → cross `rg     │ 
│ 6-08-28.md                         │ Before/After + test evidence             │ diff in 7b191e7 design enhancement               │ "aria-modal                                                                │ 
├────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────┤ 
│ docs/design-review-validation-2026 │ 18-claim ledger (A1-A8 8/8 + L4/L5/R2 +  │ Ledger distinguishes Verified (code-provable:    │ read ledger → re-run rg checks from §Validation Method table (theme        │ 
│ -08-28.md                          │ B1-B10) with rg/read/test/e2e/browser    │ B1/B2/B3/B7) vs Reasoned (aesthetic judgment:    │ tokens, z-map z-[100]/50/40, onMouseEnter vs onFocus, aria-modal,          │ 
│                                    │ method                                   │ B4-B6/B8-B10), contradicts double Executive      │ onKeyDown, onLoad, transition: opacity, text-[11px] 6 not 5)               │ 
│                                    │                                          │ Summary verdict                                  │                                                                            │ 
├────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────┤ 
│ docs/design_remediation.md         │ Deep understanding + 11-probe plan +     │ Plan was executed 1:1 (7b191e7 implements P0→P3  │ read plan checklists → map P0 B1 trap / B2 Escape+focus / P1 B3 arrows /   │ 
│                                    │ P0→P3 sequencing (intent + effort        │ sequential, TDD, no SSR/API drift, shrine-*+cn() │ P2 B7 fade+B8 easing / P3 B9 lift B10 stagger B4 ken-burns B6 draw B5      │ 
│                                    │ ~20+15+15 min)                           │  discipline)                                     │ grain to actual diffs, confirm prefers-reduced-motion kill index.css:66-78 │ 
│                                    │                                          │                                                  │  gates all motion                                                          │ 
└────────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────┘ 
 
Gate: produce evidence ledger Claim | Doc location | Code location | Method | Aligned YES/PARTIAL/NO | Snippet | Severity if gap. No doc edits until you approve. 
 
---
 
### 3 — Plan to audit the 7 recent code changes 
 
HEAD 7b191e7 is the only delta vs main for src/ (7 files, git diff HEAD~1 -- src/). Audit is read-only read + rg + pnpm gates (no edits).

┌─────┬──────────────────────────────────┬──────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────┬────────────────────────────────────────────────┐ 
│ #   │ File                             │ Claim (from remediation doc)                         │ Probe + expected                                             │ Risk to watch                                  │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ H1  │ src/components/Header.tsx +45    │ P0 B1 trap: ref drawerRef + role dialog aria-modal   │ rg "aria-modal.*true" →1, rg "onFocusCapture" →1, rg         │ Focus-return missing (WCAG returning focus),   │ 
│     │                                  │ true aria-label Mobile navigation + Tab wrap +       │ "drawerRef" →2, read getFocusable selector a[href],          │ offsetParent!==null filter is `                │ 
│     │                                  │ Escape + focus first • P0 B2:                        │ button:not([disabled]), [tabindex] + offsetParent filter +   │                                                │ 
│     │                                  │ onFocusCapture/onBlurCapture                         │ setTimeout focus — gap to flag: no focus-return to trigger + │                                                │ 
│     │                                  │ contains(relatedTarget)+window Escape                │ offsetParent filter permissive in jsdom                      │                                                │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ S1  │ src/components/SafeImage.tsx +14 │ P2 B7: loaded state+useEffect sync                   │ rg "transition-opacity" →1, rg "onLoad" →1, read             │ Cached loading=eager hero may stay opacity-0   │ 
│     │                                  │ src+transition-opacity 500 ease-out+onLoad+fallback  │ useEffect(()=>{setCurrent(src);setLoaded(false)},[src]) —    │ until load fires; second fallback failure      │ 
│     │                                  │ setLoaded false                                      │ gap: no img.complete check for cached hero, fallback error   │ never recovers                                 │ 
│     │                                  │                                                      │ leaves opacity-0                                             │                                                │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ S1t │ src/components/SafeImage.test.ts │ default lazy+fallback, opacity-0→100 on load,        │ pnpm test →3 passed (74ms), read dispatchEvent load/error —  │ Coverage of happy path only                    │ 
│     │ x new 3                          │ fallback on error via act                            │ gap: no test for prop-change resync or cached complete       │                                                │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ A1  │ src/components/ui/Accordion.tsx  │ P1 B3/L4: container onKeyDown ArrowDown/Up wrap      │ rg "onKeyDown" →2 (Header+Accordion), read tagName!==BUTTON  │ Only header buttons exist inside — safe today; │ 
│     │ +32                              │ Home/End preventDefault focus()                      │ return + querySelectorAll button + modulo wrap               │ if panel ever contains a button, selector      │ 
│     │                                  │                                                      │                                                              │ leaks                                          │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ A1t │ src/components/ui/Accordion.test │ toggle single-open, ArrowDown next, ArrowUp wrap,    │ pnpm test →4 passed (393ms), read                            │ No test for non-button target early-return     │ 
│     │ .tsx new 4                       │ Home/End                                             │ user.keyboard("{ArrowDown}") etc.                            │                                                │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ B1  │ src/components/ui/Button.tsx 1   │ P3 B9: transition-colors 200 → transition-all 300    │ rg "hover:-translate-y" →1, read baseClasses — gap:          │ transition-all heavier than precise            │ 
│     │ line                             │ hover:-translate-y-0.5 hover:shadow-shrine           │ ghost/outline-light now get shadow on hover                  │ transition-[transform,box-shadow]; ghost lift  │ 
│     │                                  │ disabled:hover:translate-y-0                         │                                                              │ may be too glossy                              │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ C1  │ src/index.css +28                │ P2 B8 cubic-bezier(0.22,1,0.36,1) on .reveal • P3 B5 │ rg "cubic-bezier\(0.22" →1, rg "mix-blend-mode" →1, rg       │ Gold-rule animates on mount not on Reveal      │ 
│     │                                  │ mix-blend-mode:multiply on .bg-grain • B6            │ "gold-rule-draw" →3, rg "hero-ken-burns" →2                  │ intersect → below-fold rules fire unseen;      │ 
│     │                                  │ gold-rule-draw 0.9s with origins center/left • B4    │                                                              │ grain multiply correct on maroon hero but      │ 
│     │                                  │ hero-ken-burns 20s                                   │                                                              │ would darken if reused on parchment            │ 
├─────┼──────────────────────────────────┼──────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────┤ 
│ Hm  │ src/pages/Home.tsx +6            │ P3 B10 facts map→Reveal delay=index*80 • B4          │ rg "hero-ken-burns" in Home →1, rg "Reveal.*delay.*index \*  │ Grid children are now Reveal divs not inner    │ 
│     │                                  │ scale-105→hero-ken-burns                             │ 80" →1, read grid gap-px sm:grid-cols-2 lg:grid-cols-4 now   │ flex divs — visual same but gap-px relies on   │ 
│     │                                  │                                                      │ has Reveal wrappers as grid children                         │ wrapper transparency; ok                       │ 
└─────┴──────────────────────────────────┴──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────┴────────────────────────────────────────────────┘ 
 
Verification gates after audit (must stay green): pnpm lint 0 ✅ pnpm typecheck 0 ✅ pnpm test 36 ✅ pnpm test:e2e 20 ✅ pnpm build 376.73kB ✅ (already re-run above). Browser sweep pnpm preview + 
agent-browser for: mobile drawer Tab-loop+Escape, desktop Tab→dropdown+Escape, FAQ arrows/Home/End, hero ken-burns, gold-rule draw, grain multiply, facts stagger. 
 
Deliverable: docs/design-review-audit-2026-08-28.md — per-file verdict PASS / PASS_WITH_NOTE / GAP + evidence snippet + severity + fix recommendation (e.g., store trigger ref + return focus, add img.complete   
guard, scope Accordion button[aria-expanded] selector, gate ghost lift). 
 
### Success criteria (gate before any code fix) 
 
- [ ] 3 docs mapped claim→byte-for-byte evidence, double-summary contradiction called out 
- [ ] 8 file deltas mapped to git show HEAD diff with rg/read hits counted 
- [ ] All 5 gates re-green, no any/bg-[#]/tailwind.config.* drift
- [ ] Ledger distinguishes Verified vs Reasoned — no inflated severity 
- [ ] You approve ledger before remediation patch 
 
### Effort 
 
Read-only probes ~20 min + ledger write ~15 min + optional browser sweep ~15 min. 

---

Option B — delivered. 4 nits patched, all 5 gates re-green. 
 
### Gates (post-nit-patch) 
 
``` 
  pnpm lint         ✅ 0 (eslint 9.39.5 --max-warnings 0 — fixed exhaustive-deps via triggerEl capture) 
  pnpm typecheck    ✅ 0 (tsc --noEmit strict) 
  pnpm test         ✅ 36/8 files (Button 6, SkipLink 3, Accordion 4, SafeImage 3, cn 5, nav 6, content 5, site 4) 
  pnpm test:e2e     ✅ 20/20 chromium (smoke 7 + navigation 5 + what-to-see 4 + give-faq 4) 25s 
  pnpm build        ✅ dist/index.html 377.47 kB gzip 110.57 kB (was 376.73 → +0.74kB for focus-return refs) 
``` 
 
### What was patched (4 nits from the read-only audit of 7b191e7 design enhancement) 
 
┌─────────────────┬────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────┐ 
│ File            │ Nit flagged in audit                           │ Patch                                                                                    │ Why                                             │ 
├─────────────────┼────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────┤ 
│ Header.tsx      │ No focus-return on Escape; offsetParent filter │                                                                                          │ aria-hiddenlets hidden els slip;                │ 
│                 │ `                                              │                                                                                          │ lintexhaustive-depsontriggerRef.current`        │ 
├─────────────────┼────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────┤ 
│ SafeImage.tsx   │ Cached loading="eager" hero stays opacity-0 if │ Added imgRef + useEffect([current]) checking img.complete && naturalWidth>0 →            │ Prevents FOIT pop-in on cache; deterministic    │ 
│                 │ load fires before onLoad attach; fallback      │ setLoaded(true); keeps onLoad fade + onError → setLoaded(false) → setCurrent(fallback)   │ fade 500ms ease-out                             │ 
│                 │ error dead-ends opacity-0                      │                                                                                          │                                                 │ 
├─────────────────┼────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────┤ 
│ Accordion.tsx   │ querySelectorAll("button") leaks if panel ever │ Scoped to button[aria-expanded] — only header buttons have aria-expanded/aria-controls   │ Roving APG pattern stays correct even if answer │ 
│                 │ contains a <button>                            │                                                                                          │ gains a button                                  │ 
├─────────────────┼────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────┤ 
│ Button.tsx      │ transition-all transitions everything (layout  │ transition-all →                                                                         │ Precise, compositor-friendly; same lift         │ 
│                 │ thrash); ghost/outline-light got unintended    │ transition-[transform,box-shadow,background-color,color,border-color,opacity]            │ hover:-translate-y-0.5 hover:shadow-shrine but  │ 
│                 │ shadow-shrine weight                           │ duration-300 ease-out                                                                    │ without animating layout                        │ 
├─────────────────┼────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────┤ 
│ index.css /     │ No code change — audited as PASS               │ Verified mix-blend-mode:multiply only on dark hero/PageHero maroon (not on parchment);   │ No fix needed                                   │ 
│ Home.tsx        │                                                │ gold-rule-draw gated by prefers-reduced-motion kill; hero-ken-burns 20s forwards scale   │                                                 │ 
│                 │                                                │ 1→1.05 separate from transition-opacity; facts Reveal delay=index*80 keeps gap-px grid   │                                                 │ 
│                 │                                                │ intact (wrappers are transparent)                                                        │                                                 │ 
└─────────────────┴────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────┘ 
 
### Per-file audit verdict (read + rg + gates) 
 
- Header.tsx — PASS_WITH_NOTE → PASS after patch. role=dialog aria-modal=true aria-label + aria-haspopup/expanded preserved, onFocusCapture/onBlurCapture contains(relatedTarget) + window Escape for desktop 
  dropdown correct, hover path retained. Remaining note: body overflow: hidden resets on unmount — mobile Safari bounce not handled (Low, out-of-scope). 
- SafeImage.tsx — PASS_WITH_NOTE → PASS after patch. fallback=/images/hero-shrine.jpg lazy dataset.fallback=1 once contract preserved, fade verified via unit test opacity-0→100. Remaining Low: 
  fallback-double-failure leaves opacity-0 (local fallback reliable, accepted). 
- SafeImage.test.tsx (new 3) — PASS. Covers lazy+fallback, fade, error swap via act. Could add prop-change resync test — Low backlog. 
- Accordion.tsx — PASS. onKeyDown wraps ArrowDown/Up modulo + Home/End, preventDefault, button[aria-expanded] scoping. Keeps grid-rows-[0fr/1fr] animation. 
- Accordion.test.tsx (new 4) — PASS. Toggle single-open + 3 keyboard paths via userEvent.keyboard. 
- Button.tsx — PASS. Lift hover:-translate-y-0.5 hover:shadow-shrine unified across 4 variants; disabled:hover:translate-y-0 disabled:hover:shadow-none correct. 
- index.css — PASS. 24 colors+2 shadows untouched; .reveal 0.7s cubic-bezier(0.22,1,0.36,1) vs generic ease; gold-rule-draw 0.9s with center/left origins; hero-ken-burns + bg-grain multiply. All gated by 
  prefers-reduced-motion: animation-duration 0.01ms !important. 
- Home.tsx — PASS. Facts stagger index*80 consistent with grounds 80/events 50; hero hero-ken-burns replaces static scale-105 ending at same 1.05. 
 
No any, no bg-[#, no tailwind.config.*, no aliased-route break, cn() discipline held. 

Remaining backlog: None P0/P1. Optional P3: scroll-linked hero parallax (translateY(scrollY*0.3)) and formal axe-core scan in E2E — deferred, not blocking. 
 
Verify locally: pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build && pnpm preview → spot-check drawer Tab-wrap+Escape focus-return, desktop dropdown Tab+Escape, FAQ arrows, hero zoom, 
gold draw, grain, facts stagger.

