# Roadmap

## Vision

A fully functional foreign exchange checker web app with real-time rates, rate history charting, multi-currency comparison, pinned favorites, and a conversion log. All data is live from the Frankfurter API, and user preferences persist in the browser via localStorage. Responsive across mobile, tablet, and desktop with a dark-themed UI.

**Stack**: React 19 + Vite + TypeScript + Tailwind CSS v4 + Zustand + Chart.js v4

## Non-Functional Requirements

| Dimension | Target | Notes |
|---|---|---|
| Expected scale (users / data volume / requests) | Single-user, client-side only | Personal tool — no backend |
| Latency budget | < 2s initial load, < 500ms conversions | API-dependent; cache layer mitigates repeat calls |
| Uptime / reliability | Best-effort (Frankfurter API uptime) | Fallback to cached rates on failure with stale banner |
| Concurrency expectations | Single user | — |
| Other constraints | Mobile-first responsive, WCAG keyboard/AT accessible | Dropdown tabs on <640px, focus management, live regions |

## Milestones

| Milestone | Status | Target | Notes |
|---|---|---|---|
| **M0 — Bootstrap** | Done | Session 1 | Document decisions, clean workspace, scaffold Vite project, init git |
| **M1 — Scaffold & Config** | Done | Session 1 | Install deps, configure Tailwind, types, API client, stores |
| **M2 — Layout Shell** | Done | Session 1-2 | Responsive grid, design tokens, global CSS, font setup |
| **M3 — Core Converter** | Done | Session 2 | Converter widget, currency picker, swap, rate display, favorite/log actions |
| **M4 — Live Markets Ticker** | Done | Session 2-3 | Auto-scrolling marquee, 24h change indicators |
| **M5 — Tab Panel** | Done | Session 3 | Tab bar (desktop/tablet/mobile), panel switching, badges |
| **M6 — Rate History Chart** | Done | Session 3-4 | Chart.js integration, range selector, stats bar, error state |
| **M7 — Compare Tab** | Done | Session 4 | Multi-currency table, pin to favorites, empty state |
| **M8 — Favorites Tab** | Done | Session 4-5 | Pinned pairs list, live rates, load into converter, empty state |
| **M9 — Log Tab** | Done | Session 4-5 | Conversion history, relative time, delete/clear, empty state |
| **M10 — Polish & A11y** | Not started | Session 5 | Focus styles, live regions, keyboard audit, responsive final pass |
| **M11 — Test Coverage** | Done | Ongoing | 34 tests passing for all DOM-isolated code per skill §6.1 |

## Tech Debt & Risk Register

| Date Identified | Item | Risk if Unaddressed | Deferred Because | Revisit When |
|---|---|---|---|---|
| 2025-05-14 | Frankfurter API has no key/rate-limit docs | Could change terms without notice | No alternative with same simplicity exists; monitor frankfurter.dev | If API changes or goes down |
| 2025-05-14 | localStorage quota (5-10MB) | Could be exceeded with very large conversion logs | Typical usage is tiny (<100 entries); not a real risk for personal tool | Only if user reports data not saving |
| 2025-05-14 | No offline support beyond stale cache | Full offline usage not possible | Stretch goal in README; not in scope for core requirements | After M10 if time permits |

## Backlog (Unscheduled)

- Light theme toggle (stretch goal from README)
- URL-persisted active pair (bookmarkable conversions)
- Keyboard shortcuts (focus search, swap, range switching)
- CSV export of conversion log
- Chart hover crosshair with exact date/rate
- Full-stack version with user accounts (cross-device sync)
