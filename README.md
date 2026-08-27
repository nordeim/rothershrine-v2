# Blessed Stanley Rother Shrine

![version 0.0.0](https://img.shields.io/badge/version-0.0.0-lightgrey)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![License Private](https://img.shields.io/badge/license-Private-lightgrey)

> **Static pilgrimage site for the National Shrine of Blessed Stanley Rother, Oklahoma City** — plan a visit, learn the story of the shepherd who stayed, and explore the Pilgrim Center, Shrine Church & Tepeyac Hill.

A single-file React SPA cloned from [rothershrine.org](https://www.rothershrine.org/) for pilgrims, parish groups, and school tours. Content is file-backed (`src/data/*`) with no backend or CMS — ships as one `dist/index.html` to GitHub Pages or S3. Warm editorial design (Fraunces + Source Sans 3) on a bespoke `shrine-*` token palette; `HashRouter` ensures deep-links work on static hosts without a server.

## Key Features

Every row below is implemented — no placeholders.

|  | Feature | What it does |
|---|---|---|
| 🏛️ | **Home — hero + quick facts** | Full-bleed hero ("The Shepherd Who Stayed"), hours/location/Mass/feast facts, welcome, grounds preview, upcoming events. |
| 📖 | **Blessed Stanley Rother** | 8-entry life timeline (1935–2023) from `lifeTimeline` — farm boy → ordination 1963 → Tz'utujil mission → martyrdom 1981 → beatification 2017. |
| ⛪ | **What to See (3 sites)** | Pilgrim Center, Shrine Church & Tomb Chapel, Tepeyac Hill — anchor-linked sections from `whatToSee` with images and detail lists. |
| 🧭 | **Pilgrimage / Visit Planning** | Hours, location, Mass schedule, group-visit guidance — canonical route `/pilgrimage` with legacy aliases `/visit-planning` + `/hours-location`. |
| 📰 | **News & Events** | Feast Day (July 28), Pilgrim Rosary Walk, TASTE + Venerable Voices series from `upcomingEvents`. Alias `/news-and-events`. |
| 🤝 | **Volunteer** | Serve opportunities for docents, hospitality, and grounds. |
| 💛 | **Give** | 8 giving options (`General Fund`, `Pipe Organ`, `Apla's Circle`, etc. from `givingOptions`). Alias `/shrinegift`. |
| ❓ | **FAQ + NotFound** | 6 FAQs (admission, Mass, accessibility, burial) and a `*` catch-all `NotFound` page. |

## Architecture

### Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI | React | `19.2.8` | Functional components + hooks only |
| Routing | React Router | `7.18.2` | `HashRouter` + `Layout` outlet + alias routes |
| Build | Vite | `7.3.6` | HMR dev, single-file prod build (+ `@vitejs/plugin-react 5.2.0`) |
| Styling | Tailwind CSS + `@tailwindcss/vite` | `4.3.3` / `4.1.17` | CSS-first `@theme` tokens in `src/index.css` |
| Language | TypeScript | `5.9.3` | `strict` + `noUnusedLocals/Params`, `bundler` mode, `@` alias |
| Icons | lucide-react | `1.34.0` | Header/footer + page iconography |
| Utils | clsx + tailwind-merge | `2.1.1` / `3.6.0` | `cn()` class merging |
| Bundling | vite-plugin-singlefile | `2.3.3` | Inlines JS+CSS into `dist/index.html` (`public/images/` copied to `dist/images/`) |
| Testing | Vitest + Testing Library + jsdom | `3.1.4` / `16.2.0` / `26.1.0` | `globals: true`, `environment: jsdom`, `setupFiles: src/test/setup.ts` (5 files / 26 tests) |
| E2E | Playwright | `1.54.1` | `chromium`, `webServer` → `pnpm dev :5173`, `e2e/` (20 tests: smoke 7 + navigation 5 + what-to-see 4 + give-faq 4) |
| Linting | ESLint flat + typescript-eslint + react-hooks | `9.23.0` / `8.28.0` / `5.2.0` | `eslint . --max-warnings 0`, `eslint.config.js` |
| Fonts | Google Fonts | — | `Fraunces` (display) + `Source Sans 3` (body) via `index.html` |

Versions pinned exact in `package.json` and match `pnpm-lock.yaml` (`--frozen-lockfile` in CI) + `package-lock.json`.

### System Diagram

```mermaid
flowchart TB
  B[Browser] --> R[HashRouter — src/App.tsx]
  R --> L[Layout — scroll & hash restore]
  L --> H[Header — sticky + scrolled + nav]
  L --> P[Pages — 10 routes]
  L --> F[Footer — 4-col + divider-weave]
  P --> D[src/data/nav.ts + content.ts]
  H & F & P --> S[Tailwind @theme — src/index.css]
  R --> V[Vite 7.3.6 + viteSingleFile 2.3.3]
  V --> O[dist/index.html + dist/images/ — primary single file + public assets]
  O --> G[GitHub Pages / S3]
```

`HashRouter` is intentional — static hosts have no SPA fallback, so `/#/pilgrimage` works without server rewrites.

## File Hierarchy

```
📂 rothershrine/
├── 📄 index.html            # lang, viewport, meta description, Google Fonts, #root
├── 📄 eslint.config.js      # flat config (typescript-eslint 8 + react-hooks 5 + react-refresh)
├── 📄 playwright.config.ts  # Playwright 1.54 (chromium, webServer → pnpm dev :5173)
├── 📄 vite.config.ts        # plugins [react, tailwindcss, viteSingleFile] + alias @→src + vitest(jsdom) + server.watch.ignored
├── 📄 tsconfig.json         # ES2020 / ESNext / bundler / strict / @/* paths + vitest/globals
├── 📄 package.json          # scripts: dev / build / preview / typecheck / lint / test / test:e2e / test:watch
├── 📂 public/
│   └── 📂 images/           # hero-shrine.jpg + shepherd-emblem.jpg via /images/*.jpg (Vite publicDir → dist/images/); whatToSee cards use Pexels CDN URLs in content.ts (local is fallback)
├── 📂 src/
│   ├── 📄 App.tsx           # HashRouter + 15 routes (7 alias pairs + 3 hash anchors + *)
│   ├── 📄 main.tsx          # StrictMode + createRoot
│   ├── 📄 index.css         # @theme shrine-* tokens (24 colors + 2 shadows) + @layer base/utilities
│   ├── 📂 components/
│   │   ├── 📄 Layout.tsx    # Outlet + scroll/hash restoration + SkipLink
│   │   ├── 📄 Header.tsx    # maroon-900 sticky, useScrolled, hover+click dropdown, mobile drawer
│   │   ├── 📄 Footer.tsx    # 4-col + divider-weave-thin + SocialIcons + site.ts address
│   │   ├── 📄 PageHero.tsx  # maroon hero primitive (compact? + bg-grain + gradients)
│   │   ├── 📄 Emblem.tsx    # inline SVG emblem (crook + wheat)
│   │   ├── 📄 SkipLink.tsx  # skip-to-main-content
│   │   ├── 📄 SocialIcons.tsx # hand-drawn brand glyphs (lucide has no brand icons)
│   │   ├── 📄 Timeline.tsx  # alternating rail + Reveal
│   │   └── 📂 ui/           # Button (to/href/button + icon), Container, SectionHeading, Accordion, Reveal
│   ├── 📂 hooks/
│   │   └── 📄 useScrolled.ts # scrollY > threshold → scrolled boolean
│   ├── 📂 pages/            # Home, AboutRother, History, WhatToSee, Pilgrimage, NewsEvents, Volunteer, Give, FAQ, NotFound (all named exports)
│   ├── 📂 data/
│   │   ├── 📄 nav.ts        # primaryNav (with description) / footerNav
│   │   ├── 📄 content.ts    # lifeTimeline, whatToSee, faqs, upcomingEvents (category), givingOptions (name+icon)
│   │   └── 📄 site.ts       # canonical address, maps URLs, contact emails — single source
│   └── 📂 utils/
│       └── 📄 cn.ts         # twMerge(clsx) — always merge via cn()
│   └── 📂 test/
│       └── 📄 setup.ts      # vitest setup (`@testing-library/jest-dom` + IntersectionObserver mock)
│       (adjacent tests: `src/utils/cn.test.ts`, `src/data/{nav,content,site}.test.ts`, `src/components/ui/Button.test.tsx` — 5 files / 26 tests)
├── 📂 e2e/
│   ├── 📄 smoke.spec.ts     # 7 smoke (alias routes + hash anchors + mobile drawer + NotFound)
│   ├── 📄 navigation.spec.ts# 5 desktop hover + keyboard + skip + footer + Give
│   ├── 📄 what-to-see.spec.ts# 4 sections + imageAlt + fallback + jump nav
│   ├── 📄 give-faq.spec.ts  # 4 Give 8 options + FAQ accordion + Pilgrimage mailto
│   └── 📄 helpers.ts        # gotoHash helper
├── 📄 .github/workflows/ci.yml # CI: lint → typecheck → test → test:e2e → build
├── 📂 docs/
│   └── 📄 prompts.md        # Intent lineage
├── 📄 CLAUDE.md             # Deep conventions (authoritative)
└── 📄 AGENTS.md             # Compact agent cheat sheet
```

## Quick Start

**Requirements:** Node.js ≥20 (Vite 7), `pnpm` preferred (`npm` works).

```bash
# 1 — Clone
git clone <repo-url> rothershrine && cd rothershrine

# 2 — Install (deterministic)
pnpm install --frozen-lockfile
# or: npm ci

# 3 — Run (HMR)
pnpm dev
# → Local: http://localhost:5173

# 4 — Production build (single file + public assets)
pnpm build
# → dist/index.html  ~370 kB (gzip ~108 kB), JS+CSS inlined; dist/images/ copied from public/

# Preview prod build
pnpm preview
# → http://localhost:4173
```

### Verify Setup

```bash
pnpm lint               # eslint flat — expect no output (clean)
pnpm typecheck         # tsc --noEmit — expect no output (clean)
pnpm test               # vitest jsdom — expect 5 files / 26 passed
pnpm test:e2e           # Playwright chromium — expect 7 passed (needs Chromium installed)
pnpm build              # expect: "✓ built in ~3s" + "Inlining: index-*.js / style-*.css"
ls -lh dist/index.html  # expect: single HTML file, no separate assets chunk
```

| Check | Expected |
|---|---|
| `pnpm dev` | Vite ready on `:5173`, HMR active |
| `pnpm lint` | Exit `0`, no warnings (`--max-warnings 0`) |
| `pnpm typecheck` | Exit `0`, no errors |
| `pnpm test` | `5 test files — 26 passed` |
| `pnpm test:e2e` | `20 tests passed` (smoke 7 + navigation 5 + what-to-see 4 + give-faq 4, chromium) |
| `pnpm build` | `dist/index.html` exists (~370 kB, gzip ~108 kB) + `dist/images/` |
| `pnpm preview` | Prod preview on `:4173`, all alias routes + `#hash` anchors navigate |

## Design System

Tokens live in `src/index.css` `@theme`. Extend there — never use arbitrary `bg-[#...]`.

| Token | Hex | Usage |
|---|---|---|
| `shrine-cream` | `#faf6ec` | Page background |
| `shrine-parchment` | `#f2e9d6` | Section bands, card fills |
| `shrine-parchment-dark` | `#e7d9b8` | Dark parchment variant |
| `shrine-stone` | `#dccfae` | Borders, dividers |
| `shrine-ink` | `#2a2115` | Primary text |
| `shrine-charcoal` | `#423a2c` | Secondary text |
| `shrine-maroon-50` | `#fbf0ee` | Ghost hover bg |
| `shrine-maroon-500` | `#7c2a25` | Eyebrow, links |
| `shrine-maroon-600` | `#691f1e` | Header icon, secondary button |
| `shrine-maroon-700` | `#55191a` | Display heading |
| `shrine-maroon-800` | `#431315` | Mid-dark maroon |
| `shrine-maroon-900` | `#33100f` | Hero + footer background |
| `shrine-maroon-950` | `#200a0a` | Deepest maroon (header top strip) |
| `shrine-gold-300` | `#e2bf72` | Eyebrow on dark, header accent |
| `shrine-gold-400` | `#d1a955` | Gold mid |
| `shrine-gold-500` | `#c3963f` | Primary button |
| `shrine-gold-600` | `#a67a2e` | Gold hover |
| `shrine-pine-500` | `#335840` | Pine accent |
| `shrine-pine-600` | `#26402f` | Accent / weave |
| `shrine-terracotta-500` | `#ab5f3c` | Community badge |
| `shadow-shrine` | `0 20px 60px -20px rgba(51,16,15,.45)` | Hero, cards, emblem |
| `shadow-shrine-lg` | `0 40px 90px -30px rgba(51,16,15,.55)` | Elevated cards, header dropdown |

**Typography:** `Fraunces` (display, quote, `font-display` / `h1–h4`) + `Source Sans 3` (body, `font-sans` / `font-body` alias) — loaded in `index.html`, set in `@theme` + `@layer base`. Utilities: `text-balance`, `bg-adobe-texture`, `bg-grain`, `divider-weave` / `divider-weave-thin`, `reveal` / `reveal-visible`, `skip-link`, `mask-fade-b`.

## Deployment

Primary artifact `dist/index.html` (+ `dist/images/`) — no server, no env vars, no rewrites needed.

```bash
pnpm build                # produces dist/index.html + dist/images/ (publicDir copy — singlefile inlines JS+CSS, not public/)
# GitHub Pages — push dist/index.html + dist/images/ to gh-pages or serve dist/ as artifact
# S3 / CloudFront — upload dist/index.html as index.html + dist/images/ assets
pnpm preview              # smoke-test before publish
```

Why `HashRouter`: deep-links like `/#/what-to-see#tepeyac-hill` resolve without host fallback config. Switching to `BrowserRouter` would require a `404.html` redirect shim.

## Contributing

This repo follows the six-phase workflow in `CLAUDE.md` (ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER).

- **TDD:** `RED → GREEN → REFACTOR → Commit` — one cycle per commit; write a failing test before fixing a bug.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:` — atomic, subject ≤72 chars.
- **Branches:** `feat/<slug>`, `fix/<slug>`, `docs/<slug>` — short-lived (1–3 days), squash-merge.
- **Conventions:** `PascalCase.tsx` for components/pages, `camelCase.ts` for data/utils, `PrimaryNav` single-source, alias routes preserved, `cn()` for merges, `shrine-*` tokens only.
- **Pre-push gate:** `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` — all five green.

> `skills/` is a symlink to `~/.pi/agent/skills` and is `.gitignore`d — don't commit it. See `AGENTS.md` for the compact cheat sheet.

## Troubleshooting

| Issue | Solution |
|---|---|
| `pnpm dev` port in use (`:5173`) | `pnpm dev -- --port 5174` or kill the other Vite process. |
| `Cannot find module '@/…'` or alias error | Ensure `vite.config.ts` alias `@→src` and `tsconfig.json` `paths {"@/*":["src/*"]}` stay in sync; restart dev server. |
| Hash anchor doesn't scroll (`#/what-to-see#pilgrim-center` lands at top) | Target `id` missing — verify `id="pilgrim-center"` exists in `WhatToSee.tsx`; `Layout.tsx` falls back to `window.scrollTo` when not found. |
| `tsc --noEmit` fails on unused var | `noUnusedLocals/Params` is `true` — remove or prefix with `_` only if intentionally unused. |

## License

Private — all rights reserved. © National Shrine of Blessed Stanley Rother, Archdiocese of Oklahoma City. No `LICENSE` file is published.

---

**Docs:** [`docs/prompts.md`](docs/prompts.md) · [`CLAUDE.md`](CLAUDE.md) · [`AGENTS.md`](AGENTS.md)
