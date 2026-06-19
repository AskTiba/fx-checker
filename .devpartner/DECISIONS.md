# Decisions Log

> Architecture, technology, and process decisions, including overridden disagreements,
> dependency choices, and git conventions.

## Decision Records

| Date | Decision | Persona | Reasoning | Alternatives Considered | User Override? |
|---|---|---|---|---|---|
| 2025-05-14 | React 19 + Vite + TypeScript | Staff Frontend Architect | Type safety for API contracts, declarative state sync across 4 interconnected widgets, strong portfolio signal for production-ready patterns | Vanilla JS ES Modules (rejected: excessive DOM-glue code for cross-widget sync), Alpine.js (rejected: state model too simple for chart/favorites/log cross-cutting concerns) | No |
| 2025-05-14 | Zustand for state management | Staff Frontend Engineer | Minimal boilerplate, built-in `persist` middleware for localStorage, simple cross-component sync without prop drilling or Provider nesting | useContext + useReducer (rejected: more boilerplate, no persistence middleware, re-render cascading), Redux Toolkit (rejected: overkill for single-user dashboard) | No |
| 2025-05-14 | Chart.js v4 + react-chartjs-2 | Data Visualization Engineer | Line + area gradient fill, auto-scaled Y-axis, date-aware X-axis at 6 granularities, responsive resize, dark theme capable — all out of box in ~50kb | Custom SVG Canvas (rejected: would require 500+ lines of manual scale/domain math, hit-testing, tooltip positioning for same visual result) | No |
| 2025-05-14 | No React Router | Frontend Architect | Tabs are in-page UI panels, not distinct pages. No URL sharing/bookmarking required. Adding router introduces a dependency + route config + URL sync for zero functional gain (YAGNI). | React Router v7 (rejected: extra complexity without benefit) | No |
| 2025-05-14 | Dropdown `<select>` on mobile (<640px) | UI/UX Engineer | Design specification explicitly states "collapse into a dropdown." Saves horizontal space at 320px. Native `<select>` has built-in accessibility with zero custom code. | Scrollable pill strip (rejected: overflow scroll + touch handling + fragile at narrow widths) | No |
| 2025-05-14 | Tailwind CSS v4 + CSS Grid | UI/UX Engineer | Utility-first responsive design, design tokens map directly to Tailwind's theming system (dark colors, accent, font). Fast responsive iteration with `sm:`/`md:`/`lg:` prefixes. No runtime cost. | CSS Modules (rejected: slower iteration for responsive variants), Styled Components (rejected: unnecessary runtime cost for this scale) | No |
| 2025-05-14 | Vitest + Testing Library + jsdom | QA Engineer | Vite-native — zero config duplication. Matches React ecosystem standard. Required for DOM-isolated test-first coverage mandated by skill §6.1. | Jest (rejected: separate config, slower), Cypress (rejected: too heavy for unit tests) | No |
| 2025-05-14 | Prettier for formatting | Staff Frontend Engineer | Zero-config, widely adopted, Vite plugin available. Single source of formatting truth. | ESLint stylistic rules (rejected: slower, duplicates concern with formatter) | No |
| 2025-05-14 | Feature branches from `main` | Git Workflow | Standard isolation: each feature/component gets its own branch. `main` stays clean. Matches the commit discipline in skill §8.8. | Direct commits to main (rejected: unsafe for multi-component development) | No |

## Git Conventions for This Project

| Aspect | Convention |
|---|---|
| Commit message format | Conventional Commits — `type: description`, ≤12 words, imperative |
| Commit types in use | feat, fix, refactor, docs, test, chore, build, perf, style, wip (default) |
| Scopes used? | No (default) |
| Default branch | main |
| Branch naming convention | `feat/<component-name>` |
| Force-push allowed on | Never without per-instance confirmation (default) |
| Amend policy notes | Only for unpushed commits that are direct corrections of the same unit |
| Commit attribution trailer | None (default) |
