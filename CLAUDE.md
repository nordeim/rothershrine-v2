---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# Blessed Stanley Rother Shrine — `rothershrine`

Clone / pilgrimage site for the **National Shrine of Blessed Stanley Rother** (Oklahoma City). Tells the story of the Oklahoma farm boy turned missionary martyr in Santiago Atitlán, Guatemala — martyred July 28, 1981, beatified Sept 23, 2017 — and guides pilgrims through the Pilgrim Center, Shrine Church & Tomb Chapel, and Tepeyac Hill.

**Stack:** React 19.2.8 + Vite 7.3.6 + Tailwind CSS 4.3.3 (`@tailwindcss/vite 4.1.17`) + TypeScript 5.9.3 (strict) + React Router 7.18.2 (HashRouter) + `vite-plugin-singlefile 2.3.3` (primary `dist/index.html` + `dist/images/`) + `eslint 9.23` flat + `vitest 3.1` (jsdom) + `@testing-library/react 16` + `playwright 1.54` (chromium) · pnpm preferred (`--frozen-lockfile` in CI) · Alias `@` → `src/` · versions pinned exact in `package.json`

> `README.md` is the visitor-facing overview; this file is the authoritative agent onboarding doc. Keep both in sync with `package.json`, `vite.config.ts`, and `tsconfig.json`.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Apply to every non-trivial task. Do not skip VALIDATE.

1. **ANALYZE** — Mine requirements in depth. Surface ambiguities, implicit needs, and trade-offs. Explore 2–3 approaches; assess feasibility and long-term cost.
2. **PLAN** — Produce a sequenced plan with phases, checklists, success criteria, and effort estimate. Present it.
3. **VALIDATE** — Obtain explicit user approval before coding. Address concerns.
4. **IMPLEMENT** — Build modular, tested, documented increments. Use library-first selection. Follow TDD Red→Green→Refactor (one commit per cycle).
5. **VERIFY** — Run typecheck / build / tests. Review against best-practice, security, performance, and WCAG AAA criteria. Cover edge cases.
6. **DELIVER** — Hand off complete solution with usage instructions, runbook, and follow-up recommendations.

### Project-Specific Principles

- **Reverent, not austere** — warm parchment/maroon/gold palette, editorial typography (Fraunces / Source Sans 3), ample whitespace. Every page is a welcome, not a brochure.
- **Content fidelity** — Clone intent is inspiration, not pixel theft. Rephrase narrative; preserve historical accuracy (dates, place names, Tz'utujil, Padre Apla's).
- **Single-file deployability** — Must remain a standalone artifact (`index.html` + assets) shippable to GitHub Pages or S3. No SSR, no server.
- **Accessibility is doctrinal** — WCAG AAA intent: keyboard-navigable header, color contrast over texture, meaningful alt text, reduced-motion respect.
- **Static-first data** — Exhibit content lives in `src/data/content.ts` and `src/data/nav.ts`; no CMS or API until explicitly requested.

## Implementation Standards

### General Coding Practices

- **Early returns** over deeply nested conditionals.
- **Composition over inheritance.** Small, focused components.
- **Self-documenting code.** Intentional names; comments explain _why_, not _what_.
- **TDD where logic exists.** Write a failing test before fixing a bug or adding a pure function.
- **No `any`.** Prefer `unknown` + narrowing. Lean on inference; add explicit return types only at public boundaries.
- **Prefer `interface` for shapes, `type` for unions/intersections.**

### Language & Framework Guidelines

#### TypeScript Strict (`tsconfig.json`)

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`, `skipLibCheck: true`.
- `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `isolatedModules: true`, `noEmit: true`.
- Path alias: `@/*` → `src/*` (mirrored in `vite.config.ts`). Always import via `@/` for cross-directory imports.
- `target: ES2020`, `lib: [ES2020, DOM, DOM.Iterable]`. Types include `node` only.
- Include is `["src", "vite.config.ts"]`. Check additions are covered by `include` or add them.

#### Vite 7 Specific

- Plugins: `@vitejs/plugin-react` + `@tailwindcss/vite` + `vite-plugin-singlefile`. Order matters — keep as configured.
- HMR enabled by default; do not add a separate dev server abstraction.
- **Env vars:** `VITE_*` prefix for client-exposed vars. Access via `import.meta.env.VITE_*`.
- Import alias configured in `vite.config.ts` via `path.resolve(__dirname, "src")`. Keep `tsconfig.json` paths in sync.
- Build is single-file: `viteSingleFile()` inlines assets. Avoid dynamic imports that assume code-splitting unless you remove the plugin intentionally.

#### React 19 + React Router 7

- Functional components only; hooks for all state/effects. No class components.
- **Routing:** `HashRouter` at `src/App.tsx` with `Layout` outlet. Preserve alias routes (e.g., `/about` ↔ `/about-blessed-stanley-rother`, `/visit-planning` ↔ `/pilgrimage`, `/shrinegift` ↔ `/give`, `/#` anchors for What-to-See). When adding routes, add both the canonical and the legacy alias if SEO or inbound links expect it.
- Keep routing declarative in `App.tsx`; do not scatter `createBrowserRouter` elsewhere.
- **Layout behavior:** `Layout.tsx` handles scroll restoration and `#hash` smooth scroll with a small `setTimeout` — preserve this pattern when extending layout concerns.
- **Navigation:** `primaryNav: NavItem[]` and `footerNav: NavLink[]` in `src/data/nav.ts` are the single source. Update nav there; Header/Footer render from it.
- Colocation: `components/` for layout primitives, `pages/` for route components, `data/` for typed content, `utils/` for pure helpers (`cn`).
- Custom hooks → `src/hooks/` when extracted (create as needed).
- Server state (future): TanStack Query; global client state: Zustand. Neither is installed yet — add only when traversal proves need.
- Handle all UI states where data is async or conditional: `loading`, `error`, `empty`, `success`. Disable buttons during async ops; show feedback.
- Use library primitives when available (no UI library locked in yet; `shadcn/ui` with Radix is the intended direction per project instructions).

#### Tailwind CSS v4 — CSS-First `@theme`

- Tokens live in `src/index.css` `@theme` block. Extend there; do not introduce arbitrary `bg-[#...]` values.
- Palette: `shrine-cream / parchment(+dark) / stone / ink / charcoal / maroon-{50,100,500,600,700,800,900,950} / gold-{100,300,400,500,600} / pine-{500,600,700} / terracotta-{400,500}` plus `shadow-shrine/shrine-lg` (24 colors + 2 shadows). Use semantic names (`shrine-maroon-600`) not hex.
- Display = `Fraunces`, body = `Source Sans 3`; heading styles set on `h1–h4, .font-display`. Google Fonts loaded in `index.html` — add weights only with purpose.
- Utilities: `text-balance`, `bg-adobe-texture`, `divider-weave` are bespoke; document new utilities alongside them.
- Mobile-first, responsive (`sm:` / `lg:`), and dark-mode tolerant even though the shrine theme is light-first.

#### Component Conventions

- `Button` (`components/ui/Button.tsx`): anchor-based variants `primary | secondary | ghost | outline-light` via `variantClasses` record and `cn()` merge. Use `to` for internal navigation, `href` for external. Keep variant styles centralized there.
- `Container` (`components/ui/Container.tsx`): `max-w-7xl mx-auto px-5 sm:px-8`. All sections should wrap in `Container`.
- `SectionHeading` (`components/ui/SectionHeading.tsx`): `eyebrow? / title / description` with `align` and `light` props.
- `PageHero` (`components/PageHero.tsx`): maroon-900 hero with low-opacity image + gradient overlays; used by most pages.
- `Header` / `Footer`: sticky header with `scrolled` state (`scrollY > 12` → translucent + blur), desktop dropdown on hover (`openDesktopMenu`), mobile drill-down, and hash-aware closing on route change. Preserve keyboard + `aria-expanded` behavior when modifying.
- `cn` (`utils/cn.ts`): `twMerge(clsx(...))` — always merge classes through `cn()`.

## Development Workflow

### Environment Setup

```bash
# Node 20+ required (Vite 7.3.6). pnpm preferred; npm works.
pnpm install --frozen-lockfile  # deterministic (versions pinned exact in package.json)
# or: npm ci
cp .env.example .env.local 2>/dev/null || true  # no env vars required yet
pnpm dev              # http://localhost:5173
```

No backend, no DB, no `.env` contract yet. If env vars are added, document them in "Environment Variables" below.

### Build Commands

| Command | Purpose | Verified |
|---------|---------|----------|
| `pnpm dev` / `npm run dev` | Vite dev server with HMR (default http://localhost:5173) | ✅ in `package.json` |
| `pnpm build` / `npm run build` | Production single-file build (`vite build` + `viteSingleFile`) → `dist/index.html` | ✅ |
| `pnpm preview` / `npm run preview` | Preview `dist` build locally | ✅ |
| `pnpm typecheck` / `npm run typecheck` | Type gate `tsc --noEmit` | ✅ |
| `pnpm lint` / `npm run lint` | ESLint flat `eslint . --max-warnings 0` (`eslint.config.js`) | ✅ |
| `pnpm lint:fix` | ESLint auto-fix | ✅ |
| `pnpm test` / `npm run test` | Vitest `jsdom` — `vitest run` (26 tests, 5 files) | ✅ |
| `pnpm test:watch` | Vitest watch mode | ✅ |
| `pnpm test:e2e` / `npm run test:e2e` | Playwright `chromium` — `playwright test` (20 tests: smoke 7 + navigation 5 + what-to-see 4 + give-faq 4) | ✅ |
| `pnpm test:e2e:ui` | Playwright UI mode | ✅ |

> Before documenting a command as available, verify it in `package.json` scripts. Gate is now `lint && typecheck && test && test:e2e && build`.

### Adding Tooling (wired — 2026-08-27)

Wired: `eslint 9.23` flat + `typescript-eslint 8.28` + `eslint-plugin-react-hooks 5.2` + `eslint-plugin-react-refresh 0.4` + `globals 16` → `eslint.config.js` (flat) + `vitest 3.1` + `jsdom 26` + `@testing-library/react 16` + `@testing-library/jest-dom 6` + `@testing-library/user-event 14` → `vite.config.ts` `test` + `src/test/setup.ts` (jest-dom + IntersectionObserver mock). Scripts added: `typecheck`, `lint`, `lint:fix`, `test`, `test:watch`, `test:coverage`.

Previous bootstrap (for reference):

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D @playwright/test && npx playwright install chromium
```

## Testing Strategy

Current status: **wired — 26 unit + 20 E2E, all green (46 total).** `vitest 3.1` (jsdom) + `@testing-library/react 16` + `jsdom 26` + `src/test/setup.ts` (`jest-dom` + `IntersectionObserver` mock) + `playwright 1.54` (chromium, `playwright.config.ts` + `e2e/` 4 specs). Run `pnpm test` (unit), `pnpm test:watch` (watch), `pnpm test:e2e` (E2E, `webServer` → `pnpm dev :5173`). `vitest` config lives in `vite.config.ts` `test`.

Coverage so far — **unit (5 files / 26):**
- Pure helpers — `src/utils/cn.test.ts` (twMerge dedup, clsx falsy)
- Nav data invariants — `src/data/nav.test.ts` (6 primaryNav, 2 with children+description, hash anchors, footerNav 10)
- Content data invariants — `src/data/content.test.ts` (lifeTimeline 8, whatToSee 3+imageAlt, faqs 6, upcomingEvents 4+category, givingOptions 8+icon)
- Site invariants — `src/data/site.test.ts` (address, maps URLs, contact, hours)
- UI primitive — `src/components/ui/Button.test.tsx` (to→Link, href→a, button→button, variants)

**E2E (4 files / 20, chromium):**
- `e2e/smoke.spec.ts` (7) — alias routes (7 pairs), double-hash anchors, mobile drawer, NotFound
- `e2e/navigation.spec.ts` (5) — desktop hover dropdown (`aria-expanded`), keyboard nav, SkipLink (`#main-content` focus), footer 10 links, Give top bar
- `e2e/what-to-see.spec.ts` (4) — 3 sections + imageAlt/details, CDN fallback (`route.abort` → local hero), jump nav `Link` preserves route, Home grounds cards
- `e2e/give-faq.spec.ts` (4) — Give 8 options + external `https://www.rothershrine.org/give`, FAQ accordion single-open (`aria-expanded`), Pilgrimage mailto + Find Us, Footer Give

### When to Add More Tests

- Additional pure helpers (`src/utils/*`, selectors, content transforms) — unit tests.
- Routing contract — `App.tsx` alias routes + hash anchors integration (MemoryRouter) — now covered by `e2e/smoke.spec.ts` for critical paths.
- Critical journeys — expand `e2e/` beyond smoke: `navigation.spec.ts` (desktop hover, a11y), `what-to-see.spec.ts` (3 sections + imageAlt fallback), `give-faq.spec.ts` (Give 8 options + FAQ accordion). See `e2e/smoke.spec.ts` for pattern.
- Visual / a11y — add `axe` scan + `playwright` trace/video (already `on-first-retry`).

Conventions: `*.test.tsx` adjacent to source, `__mocks__` only when isolating `react-router-dom`, and `src/data/content.ts` factories (`getMockTimelineEntry`, `getMockWhatToSee`) for fixtures when needed.

## Code Quality Standards

### Linting & Formatting (wired)

`eslint 9.23` flat config (`eslint.config.js`) — `typescript-eslint 8.28` + `eslint-plugin-react-hooks 5.2` + `eslint-plugin-react-refresh 0.4` + `globals 16`. Run `pnpm lint` (`eslint . --max-warnings 0`) and `pnpm lint:fix` for auto-fix. Gate for pre-ship:

```bash
pnpm lint               # eslint flat — no warnings
pnpm typecheck          # tsc --noEmit
pnpm test               # vitest jsdom — 26 tests
pnpm build              # vite build — singlefile inlines correctly
```

### Type Safety

- No `any`; `as any` is a last resort with a `// ponytail:` ceiling comment.
- `unknown` + narrowing at trust boundaries (URL params, external JSON).
- Keep `tsconfig.json` strict flags on; do not relax to silence errors.

### Styling Discipline

- Use existing `shrine-*` tokens before introducing new colors.
- No redundant CSS: extend `@theme` or add a named `@utility`; do not duplicate utilities across components.
- Keep bespoke CSS to `src/index.css` `@layer` blocks.

## Git & Version Control

### Branching

- `main` is the deploy branch (single-file artifact).
- Feature branches: `feat/<slug>`, fixes: `fix/<slug>`, docs: `docs/<slug>`. Short-lived (1–3 days), rebase or squash-merge.
- Do not commit `node_modules/`, `.next/`, `dist/`, or `skills/` (symlink to `~/.pi/agent/skills` excluded by `.gitignore`).

### Commit Standards

- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`.
- Atomic commits (one logical change). Subject ≤ 72 chars; body explains why.

### Push / Deploy

Gate before pushing `main` (or CI):

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build
git push origin main
```

No CI workflow yet — gate is local. Add GitHub Actions when ready (lint → typecheck → test → test:e2e → build). E2E needs `npx playwright install --with-deps chromium` in CI.

Primary artifact `dist/index.html` (+ `dist/images/` copied from `public/` — `viteSingleFile` inlines JS+CSS, not `publicDir`) deploys directly to GitHub Pages (via `gh-pages` branch or `dist` artifact — upload both) or S3 — ensure hash routing remains (`HashRouter` avoids 404s on static hosts).

## Error Handling & Debugging

- SPA has no server failures; handle: broken image fallbacks, unknown routes → `NotFound` (`pages/NotFound.tsx`), and empty content states per page.
- `Layout` scroll logic should degrade gracefully when a `#hash` target is missing (current behavior: falls back to `window.scrollTo`).
- For future data fetching (CMS/API): wrap with error boundaries and show user-friendly messages; never leak raw errors.
- Debugging: Vite HMR overlay + React DevTools. For `HashRouter` issues, inspect `location.pathname` + `location.hash` in `Layout`'s `useEffect`.

## Communication & Documentation

- Explain _why_ behind shrine-specific choices (historical wording, liturgical dates, cultural sensitivity around Guatemalan / Tz'utujil references).
- Keep `docs/prompts.md` for lineage prompts; update when intent shifts.
- Document new routes, tokens, or images in this file and in `src/data/nav.ts` / `src/data/content.ts` comments where applicable.
- Preserve dual-route aliases when renaming legacy paths (external links exist).

## Project-Specific Standards

### Architecture

```
src/
  App.tsx                # HashRouter + route table + alias routes
  main.tsx               # StrictMode + createRoot
  index.css              # Tailwind v4 @theme + @layer base/utilities
  components/
    Layout.tsx           # Outlet + scroll/hash restoration
    Header.tsx           # sticky + scrolled + desktop hover + mobile drawer
    Footer.tsx           # 4-col + divider-weave
    PageHero.tsx         # maroon hero primitive
    ui/                  # Button / Container / SectionHeading
  pages/
    Home.tsx             # hero + quickFacts + welcome + grounds + events
    AboutRother.tsx / History.tsx / WhatToSee.tsx / Pilgrimage.tsx
    NewsEvents.tsx / Volunteer.tsx / Give.tsx / FAQ.tsx / NotFound.tsx
  data/
    nav.ts               # primaryNav / footerNav (single source)
    content.ts           # lifeTimeline, whatToSee, faqs, upcomingEvents, givingOptions
  utils/
    cn.ts                # clsx + tailwind-merge
public/
  images/                # hero-shrine.jpg + shepherd-emblem.jpg (served at /images/... → dist/images/); whatToSee cards use Pexels CDN URLs in content.ts
```

- **Data ownership:** Narrative and exhibit data is typed in `content.ts` (`TimelineEntry`, `WhatToSeeSection`, `FaqItem`, `EventItem`, `GivingOption`). Pages render from these arrays — do not inline copy that belongs in `data/`.
- **Routing model:** Client-side only; no loaders or server components. Alias routes (`/about` + `/about-blessed-stanley-rother`, `/what-to-see` + `/grounds-art-architecture`, `/pilgrimage` + `/visit-planning` + `/hours-location`, `/news-events` + `/news-and-events`, `/give` + `/shrinegift`) are intentional — keep them when adding new canonical paths.
- **No global store yet.** Lift state only when cross-page need proves itself.

### File Organization & Naming

- Components: `PascalCase.tsx` (e.g., `PageHero.tsx`); hooks: `useThing.ts`.
- Data/utils: `camelCase.ts` (`content.ts`, `cn.ts`).
- Pages: `PascalCase.tsx` matching route intent (`Pilgrimage.tsx`, `WhatToSee.tsx`).
- Assets: `public/images/<slug>.jpg` — hero/emblem reference as `/images/<slug>.jpg` (absolute from root, Vite `publicDir` → `dist/images/` — upload alongside `dist/index.html`; singlefile does not inline `public/`). WhatToSee cards use Pexels CDN URLs in `src/data/content.ts`.
- Tests: `*.test.tsx` adjacent to source — `src/utils/cn.test.ts`, `src/data/{nav,content,site}.test.ts`, `src/components/ui/Button.test.tsx` (5 files / 26 tests) + `src/test/setup.ts`.

### Design System

- Tokens: see `src/index.css` `@theme`. Additions require design rationale in PR description.
- Typography scale: `Fraunces` for display/quote, `Source Sans 3` for body. Use `font-display` class for intentional display turns.
- Elevation: `shadow-shrine` (`0 20px 60px -20px rgba(53,16,18,.35)`). Use sparingly (hero, cards, emblem).
- Do not introduce purple gradients, `Inter` defaults, or generic card-grid templates — anti-generic enforcement (see Avant-Garde stance below).
- Reference skill: `avant-garde-design-v4` for direction when adding new sections; extract from live shrine only via `agent-browser` workflows when explicitly requested.

### State & Data Layer

- No API or DB. Content arrays in `src/data/content.ts` are the data layer. Validate shape with TypeScript interfaces; add Zod schemas only if external data arrives.
- For future CMS integration (e.g., Sanity), isolate fetch + Portable Text rendering behind a `lib/cms` boundary and keep `content.ts` as the local fallback.

### Environment Variables

| Variable | Purpose | Example | Status |
|----------|---------|---------|--------|
| `VITE_*` | Client-exposed Vite vars | `VITE_MAPS_KEY=...` | None required yet |
| _none_ | _No backend contract_ | — | — |

When adding vars, document them here and in `.env.example`, and guard with `import.meta.env` typing in `src/env.d.ts`.

### Accessibility & SEO

- `index.html` ships `lang="en"`, `viewport`, `description`, and preconnected Google Fonts. Extend with Open Graph / JSON-LD only with real shrine data.
- Header mobile toggle uses `aria-label` + `aria-expanded`; dropdowns should acquire `aria-haspopup` / focus-trap if converted to click-open.
- Images: `alt` for content, `alt=""` + `aria-hidden` for decorative hero overlays (as `PageHero` does).
- Keep color contrast ≥ 4.5:1 for body text (`shrine-ink` on `shrine-cream` meets it; verify new pairings).

## Anti-Patterns to Avoid

- **Copy-paste from templates as truth** — verify every command in `package.json` before documenting it.
- **Extending `@theme` with one-off hex values** — add a named token or reuse an existing `shrine-*` token.
- **Prop-drilling nav arrays** — consume `primaryNav` / `footerNav` directly from `data/nav.ts`.
- **Converting `HashRouter` to `BrowserRouter` without a static-host fallback** — breaks deep-links on GitHub Pages/S3 unless you add a 404.html redirect.
- **Breaking alias routes** — external parish/school links depend on legacy paths; keep aliases or add explicit redirects.
- **Importing Google Fonts imperatively in components** — fonts belong in `index.html` + `@theme`; do not add runtime font loaders.
- **Bypassing `cn()` for conditional classes** — always merge via `cn()` so `tailwind-merge` deduplicates correctly.
- **Adding a UI library without adopting its primitives** — if `shadcn/ui` (Radix) is introduced, use its primitives; do not rebuild Dialog/Dropdown from scratch.
- **Over-hydrating or adding SSR** — this is a static SPA; do not introduce server rendering or API routes without a deliberate architecture decision.

## Success Metrics

You are done when:

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (26), `pnpm test:e2e` (20, chromium), and `pnpm build` are all green (46 total).
- All 10 pages + alias routes + `#hash` anchors (Pilgrim Center / Shrine Church / Tepeyac Hill, `pilgrimage#visit`) navigate correctly, including direct hash URLs on static hosts.
- Header is sticky, `scrolled` translucency works, mobile drawer traps focus and closes on navigation, and keyboard navigation covers all nav items.
- Content renders from `src/data/*` without inline duplication; new tokens live in `src/index.css` `@theme`.
- No `any`, no unused locals/params, no missing alt text on content images.

## System Integration

### Available Tools (in this workspace)

- `read` / `write` / `edit` / `bash` / `fd` / `rg` / `agent-browser` / `subagent_spawn` / `workflow` — standard Pi harness.
- `skills` is a symlink to `~/.pi/agent/skills` (ignored by `.gitignore`). Resolve skill docs against that symlink, not `CWD/skills`.

### Related Skills

- `framework-templates` — companion to `claude-md` for framework sections (Vite+React used here).
- `avant-garde-design-v4` / `super-frontend-design` / `claude-design` — when refining shrine aesthetics.
- `webapp-testing-journey` / `agent-browser` / `playwright-cli` — when exercising journeys or visual QA.
- `verification-and-review-protocol` — before claiming work done.
- `lint-and-validate` / `clean-code` / `testing-patterns` — quality gates.

## Continuous Improvement

- When a command is added to `package.json` scripts, update the Build Commands table.
- When a token or utility is added to `src/index.css`, document its intent in this file and in a code comment.
- When a route alias is added or removed, update both `App.tsx` and `data/nav.ts` guidance above.
- Re-audit this file after any framework bump (React 19, Vite 7, Tailwind 4) or after introducing tests/lint/CMS.

---

### Validation Checklist (for maintainers)

| # | Section | Required | Present |
|---|---------|----------|---------|
| 1 | Core Identity & Purpose | Yes | ✅ |
| 2 | Foundational Principles (Six-Phase) | Yes | ✅ |
| 3 | Implementation Standards | Yes | ✅ |
| 4 | Development Workflow | Yes | ✅ |
| 5 | Testing Strategy | Yes | ✅ |
| 6 | Code Quality Standards | Yes | ✅ |
| 7 | Git & Version Control | Yes | ✅ |
| 8 | Error Handling & Debugging | Yes | ✅ |
| 9 | Communication & Documentation | Yes | ✅ |
| 10 | Project-Specific Standards | Yes | ✅ |
| 11 | Success Metrics | — | ✅ |
| 12 | System Integration | — | ✅ |
| 13 | Anti-Patterns to Avoid | — | ✅ |
| 14 | Continuous Improvement | — | ✅ |
