# Code Review & Audit Plan — rothershrine v1.3.0

## Goal
Run a **tiered code review + security audit** that proves the SPA matches its documented contracts (AGENTS/CLAUDE/README/SKILL) and is safe to ship — producing a severity-ranked report with evidence and a remediation backlog. No fix without consent; no completion claim without fresh verification (Iron Law).

## Skills Selected (Why)

| Skill | Role in this audit |
|-------|--------------------|
| **code-review-and-audit** | Orchestrator — sequences 5 phases + report, mode-aware |
| **lint-and-validate** | Phase 1 — eslint 9.23 flat + `tsc --noEmit` (Node/TS path) |
| **vulnerability-scanner** | Phase 2 — OWASP 2025 A01–A10, supply chain, secrets, injection, config |
| **code-quality-standards** | Phase 3 constitution — Six-Axis (Correctness/Readability/Architecture/Security/Performance/Aesthetic Rigor) + Anti-Generic litmus |
| **code-review-checklist** | Phase 3 tactical scan — 12 categories (Correctness→Anti-Patterns) |
| **clean-code** | Script output handling (READ→SUMMARIZE→ASK→FIX→RE-RUN) + dead-code hygiene |
| **testing-patterns** | Phase 4 — vitest 3.1.4 jsdom + playwright 1.54.1 chromium coverage & pass-rate |
| **verification-and-review-protocol** | Iron Law + Phase 6 expert subagent dispatch (deep mode) |
| **performance-profiling** | Phase 5 — Core Web Vitals (deep only, requires URL) |

Native CLI fallback if `scripts/audit_runner.py` absent (checked first per skill).

## Mode Recommendation

- **Default: `standard`** (Phases 1+2+3, threshold High, <2 min) — fits pre-merge gate for static SPA.
- **On request: `deep`** (All 5 + Phase 6 expert review, threshold Medium, <5 min) — for release/compliance, adds performance + subagent review; requires `pnpm preview` URL.
- `quick` (Phase 1 only) and `security-only` (Phase 2) available on demand.

## Tasks

- [ ] **T1 — Recon + script detection** → Verify: `ls scripts/audit_runner.py || echo "use native CLI"` + `fd src --type file | wc -l` (38), `pnpm-lock.yaml` present, `skills` symlink ignored. Records project path and fallback choice.
- [ ] **T2 — Phase 1 Static Analysis (lint-and-validate)** → Verify: `pnpm lint` + `pnpm typecheck` exits 0, `tsc --noEmit` with `strict+noUnusedLocals/Params` clean. Capture outputs; on Critical fail → stop pipeline. If fallback, run native CLI as above.
- [ ] **T3 — Phase 2 Security Scan (vulnerability-scanner, OWASP 2025)** → Verify: `pnpm audit`, lockfile integrity, secret patterns (`rg -n "API_KEY|SECRET|PASSWORD|TOKEN"`), dangerous patterns (`eval/innerHTML/Function`), config scan (`verify=False`, CORS, debug). Map findings to A01–A10 + supply-chain (A03). Static SPA gates: secrets, XSS (dangerouslySetInnerHTML), supply chain pinned exact.
- [ ] **T4 — Phase 3 Code Quality (Six-Axis + 12-category checklist)** → Verify: Manual + checklist_runner against 12 categories — correctness (unsafe array/null), security, performance (N+1/large imports), quality (long funcs >500 chars), testing, docs, error handling (empty catch), naming, type safety (`:any/@ts-ignore`), React/UI (missing deps/loading states), LLM patterns, anti-patterns (magic numbers/deep nesting). Cross-check `code-quality-standards` Axis 6 Anti-Generic (rejection matrix: bento grids, Inter/Roboto safety, purple gradients) — N/A here but verify `shrine-*` tokens only.
- [ ] **T5 — Phase 4 Test Coverage (testing-patterns)** → Verify: `pnpm test` (26/5) + `pnpm test:e2e` (20/4 chromium) green, `src/test/setup.ts` mocks intact, no skipped tests, `**/*.test.ts` colocated + `e2e/` isolated. Report pass rate + failed names.
- [ ] **T6 — Phase 5 Performance (deep only, optional)** → Verify: `pnpm build` singlefile 370 kB (gzip 108 kB) + `pnpm preview` → `npx lighthouse <url>` or bundle analyzer if URL given; else mark SKIPPED with reason. Core Web Vitals thresholds documented.
- [ ] **T7 — Aggregation + severity classification** → Verify: JSON by phase + markdown `.audit-report.md` generated with sections 🔴Critical/🟠High/🟡Medium/🟢Low/⚪Info/✅Passed, each finding has file:line/snippet/phase/remediation, `by_severity` counts, `exit_code` per mode threshold, failed_phases list.
- [ ] **T8 — Verification gate + expert review + handoff** → Verify: Iron Law — re-run fresh `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` before any claim; if `deep`, dispatch `code-reviewer` subagent (BASE_SHA/HEAD_SHA + WHAT_WAS_IMPLEMENTED) and triage Critical/Important/Minor; present summary, ask `Should I fix the X errors?`, await consent before fixes, then re-run.

## Done When

- [ ] Mode selected with rationale recorded; script vs native path logged
- [ ] Phases 1–5 (or 1+2+3 for standard) executed with raw outputs read and summarized per Script Output Handling (READ→SUMMARIZE→ASK)
- [ ] `.audit-report.md` written to project root with severity breakdown + OWASP A01–A10 mapping + remediation guidance
- [ ] Exit code matches mode threshold (0 pass, 1 fail); no Critical findings silently deferred
- [ ] Iron Law satisfied: every "pass/build succeeds" claim backed by fresh terminal evidence shown
- [ ] If deep: Phase 6 expert review dispatched and findings triaged (Critical→fix, Important→before merge, Minor→deferred with note)

## Notes

- **Project-specific tailor:** Static SPA → no backend/API/DB, so A01 Access Control, A05 injection surface is limited to XSS via `dangerouslySetInnerHTML`/external image URLs (`SafeImage` fallback) + `HashRouter` hash parsing; A03 supply-chain is primary risk (pin exact + `--frozen-lockfile`). Performance phase needs preview URL — skip if not provided.
- **Anti-patterns to enforce:** No `any`, no arbitrary `bg-[#...]`, no `tailwind.config.*` drift, no broken alias routes, no bare `<img>` for CDN, no prop-drilling nav.
- **Tool fallback:** Check `if [ -f "scripts/audit_runner.py" ]` first; else use native CLI table from skill. Never hallucinate script success.
- **Deliverables:** `.audit-report.md` + stdout severity table + JSON (with `--json-only` for CI). Fixes only after explicit user approval.
- **Effort:** Standard ~2 min (lint+typecheck ~10s, npm audit ~5s, checklist manual ~60s, tests 35s, build 5s); Deep ~5 min + expert review queue.
