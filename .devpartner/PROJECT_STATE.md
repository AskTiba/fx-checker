# Project State

> Last updated: 2025-05-14 15:30
> This file is the source of truth for project continuity across sessions.

## 1. Project Snapshot

| Field | Value |
|---|---|
| Project name | FX Checker |
| Primary stack | React 19 + Vite + TypeScript + Tailwind CSS v4 + Zustand + Chart.js |
| Repo / branch | `main` — 6 commits since init |
| Current milestone | M0-M2 complete — Scaffold, Config, Layout Shell, Core Components |
| Overall status | Green |

## 2. What Currently Works

| Feature | Verified by | Notes |
|---|---|---|
| Vite + React + TS scaffold | `npm run build` passes | Zero type errors, production build produces dist/ |
| Tailwind CSS v4 with design tokens | Build succeeds | Dark theme tokens: surface-900→800→700→600→500, accent `#cef739`, mono font |
| Type definitions | `npx tsc --noEmit` passes | `Currency`, `Rate`, `TimeSeries`, `FavoritePair`, `ConversionEntry`, `TabId`, `ChartRange`, `ChartStats` |
| Frankfurter API client | Type-checked | `getCurrencies()`, `getLatest()`, `getTimeSeries()` with in-memory cache |
| Zustand stores | 8 store tests pass | Converter, Favorites (localStorage), Log (localStorage), UI (tab persistence) |
| DOM-isolated test suite | `vitest run` — 34/34 pass | storage, format, filter, stores |
| Responsive grid shell | Build compiles | `lg:grid-cols-[416px_1fr]` desktop, single-column tablet/mobile |
| Logo + Ticker header | Built | Logo SVG, currency count from API, auto-scroll marquee pause-on-hover |
| Converter widget | Built | Send/receive amounts, currency buttons, swap, rate display, favorite + log actions |
| Currency picker popover | Built | Searchable, grouped (Popular/Other), checkmark on selected, keyboard focus trap, Escape to close |
| Tab panel | Built | Desktop tab bar with badges, mobile `<select>` dropdown, 4 tabs managed by store |
| History tab | Built | Chart.js line+area chart, range selector (1D/1W/1M/3M/1Y/5Y), Open/Last/Change/% stats, loading/error states |
| Compare tab | Built | Multi-currency table, pin stars, empty state when no amount entered |
| Favorites tab | Built | Pinned pairs with live rates, click-to-load into converter, remove pin, empty state |
| Log tab | Built | Conversion entries with relative time, delete per-entry, Clear All with confirmation, empty state |
| Static assets | Copied to `public/assets/` | Icons (SVG), flags (60 webp), logo, favicon, JetBrains Mono font TTF |

## 3. In Progress

| Task | Files involved | Exact next step | Verification owed |
|---|---|---|---|
| End-of-session documentation | `.devpartner/*.md` | Update state files to reflect current progress | Manual review |
| Git initialization | — | Propose `git init` to user, await approval | User confirmation |

## 4. Known Issues / Blocked

| Issue | Impact | Blocked on | Priority |
|---|---|---|---|
| No git repo initialized | No version history | User must confirm `git init` | Low |

## 5. Up Next (Roadmap-aligned)

1. Initialize git repository
2. Accessibility audit (focus management, ARIA live regions, keyboard nav)
3. Responsive final pass (test at 320px, 375px, 480px, 640px, 768px, 1024px, 1440px)
4. Light theme toggle (stretch goal)
5. URL-persisted active pair (stretch goal)

## 6. Conventions & Environment

| Aspect | Convention |
|---|---|
| Formatter / linter | Prettier (default config) |
| Type-check command | `npx tsc --noEmit` |
| Test framework / command | Vitest + Testing Library — `npm run test` (34 tests) |
| Branching model | Feature branches from `main` (`feat/<name>`) |
| Env setup command | `npm install && npm run dev` |
| Secrets location | N/A — no backend, no API key needed (Frankfurter API is public) |
| Key architectural pattern | Feature-first: `src/api/`, `src/store/`, `src/components/`, `src/lib/`, `src/types/` |

## 7. Checkpoints / Rollback Points

| Date | Tag / Branch | Created Before | Still Relevant? |
|---|---|---|---|

## 8. Open Questions for User

- None — all decisions finalized and implemented.
