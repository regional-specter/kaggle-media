# KaggleFlow — Project Context

This document captures what the project is, how it is built, where it stands today, and what remains before public deployment. It is intended for developers (and AI assistants) picking up the codebase cold.

---

## What this project is

**KaggleFlow** is a client-side React application for exploring Kaggle datasets and bookmarking favorites. Users supply their own Kaggle API credentials; the app fetches live dataset metadata from the [Kaggle REST API](https://www.kaggle.com/api/v1) and presents it in a premium dashboard-style UI inspired by tools like Tableau Pulse.

It is **not** affiliated with Kaggle. It is a third-party frontend that consumes Kaggle's public API using Basic Authentication.

---

## Current status

| Area | Status |
|------|--------|
| UI / UX | Functional — responsive layout, animations, skeleton loaders, empty/error states |
| Discover Feed | Implemented — search, sort, infinite scroll |
| Bookmarks | Implemented — persisted in `localStorage` |
| Settings / credentials | Implemented — save, validate, clear |
| Production API access | **Not ready** — direct browser calls to Kaggle are blocked by CORS |
| Backend / proxy | **Not implemented** |
| Tests | **None** |
| CI/CD | **None** |
| Deployment config | **None** (`vercel.json`, serverless functions, etc.) |

The app builds successfully (`npm run build`) and runs locally (`npm run dev`), but **API calls from a deployed browser environment will fail** until a server-side proxy is added.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | Lucide React |
| Animation | Framer Motion |
| Routing | None — tab-based view switching via React state (no React Router) |
| State | React hooks + `localStorage` (no Redux/Zustand) |
| API | Native `fetch` with HTTP Basic Auth |

**Font:** Plus Jakarta Sans (loaded from Google Fonts in `index.html`).

**Node:** Vite 6 recommends Node 20.19+ or 22.12+. The project was developed on Node 20.17 with Vite 6 after downgrading from Vite 8.

---

## Project structure

```
kaggle-scroller/
├── index.html                  # Entry HTML, font links, app title
├── vite.config.ts              # Vite + React + Tailwind plugins
├── package.json
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Top-level tab orchestration
│   ├── index.css               # Tailwind import, theme tokens, base styles
│   │
│   ├── api/
│   │   └── kaggle.ts           # Kaggle REST client, response normalization, metadata enrichment
│   │
│   ├── types/
│   │   └── kaggle.ts           # KaggleCredentials, KaggleDataset, AppTab, etc.
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts  # Generic localStorage sync with cross-tab support
│   │   ├── useCredentials.ts   # Kaggle username + API key persistence
│   │   ├── useBookmarks.ts     # Bookmark refs + dataset metadata cache
│   │   └── useDatasets.ts      # Paginated feed fetching + background description enrichment
│   │
│   ├── utils/
│   │   ├── format.ts           # Number/date/byte formatting, trend simulation, description helpers
│   │   └── motion.ts           # Shared Framer Motion variants and transitions
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx   # Page shell, background gradient, main padding
│   │   │   └── NavBar.tsx      # Top header (desktop) + bottom tab bar (mobile)
│   │   ├── datasets/
│   │   │   ├── DatasetCard.tsx
│   │   │   ├── DatasetCardSkeleton.tsx
│   │   │   ├── DatasetGrid.tsx # Responsive grid + infinite scroll sentinel
│   │   │   └── Sparkline.tsx   # SVG sparkline with draw animation
│   │   ├── settings/
│   │   │   └── CredentialsForm.tsx
│   │   └── ui/
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       ├── PageTransition.tsx
│   │       └── StatusBadge.tsx
│   │
│   └── views/
│       ├── DiscoverFeed.tsx
│       ├── BookmarkedView.tsx
│       └── SettingsView.tsx
└── dist/                       # Production build output (gitignored)
```

---

## Application architecture

### High-level flow

```
┌─────────────────────────────────────────────────────────────┐
│  App.tsx                                                    │
│  ├── useCredentials()  → localStorage                       │
│  ├── useBookmarks()    → localStorage                       │
│  └── activeTab state   → Discover | Bookmarked | Settings   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  DiscoverFeed                                               │
│  └── useDatasets()                                          │
│       ├── listDatasets()         → GET /datasets/list       │
│       └── enrichDatasetsWithDescriptions()                  │
│            └── getDatasetMetadata() per dataset (batched)   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  api/kaggle.ts                                              │
│  fetch("https://www.kaggle.com/api/v1/...")                 │
│  Authorization: Basic btoa(username + ":" + apiKey)         │
└─────────────────────────────────────────────────────────────┘
```

There is **no server layer**. All API traffic originates in the browser.

### View navigation

Tabs are controlled by a single `useState<AppTab>` in `App.tsx`. There is no URL routing — refreshing the page always returns to the default tab (`discover`). Tab transitions use Framer Motion's `AnimatePresence` and a `PageTransition` wrapper.

**Tabs:**
- `discover` — main dataset feed
- `bookmarked` — saved datasets
- `settings` — API credential configuration

### State management

All persistent state lives in **`localStorage`** via `useLocalStorage`:

| Key | Contents |
|-----|----------|
| `kaggle-scroller:credentials` | `{ username, apiKey }` |
| `kaggle-scroller:bookmarks` | `string[]` of dataset `ref` values |
| `kaggle-scroller:bookmark-cache` | `Record<string, KaggleDataset>` — full dataset objects keyed by ref |

**Bookmarks** store refs as the source of truth, but also cache the full `KaggleDataset` object at bookmark time so the Bookmarked tab can render cards without re-fetching from the API.

**Credentials** are stored in plaintext in `localStorage`. They are never sent anywhere except directly to Kaggle's API (via `Authorization: Basic` headers).

---

## Kaggle API integration

### Base URL

```
https://www.kaggle.com/api/v1
```

Defined as `KAGGLE_API_BASE` in `src/api/kaggle.ts`.

### Authentication

HTTP Basic Auth, constructed client-side:

```ts
const token = btoa(`${username}:${apiKey}`)
// Header: Authorization: Basic <token>
```

Users obtain credentials from [kaggle.com/settings](https://www.kaggle.com/settings) (API token section).

### Endpoints used

| Endpoint | Purpose |
|----------|---------|
| `GET /datasets/list` | Paginated dataset feed. Params: `sort_by`, `page`, `search`, `page_size` |
| `GET /datasets/metadata/{owner}/{slug}` | Fetch subtitle/description when not returned by list |

### Response normalization

Kaggle's API may return fields in `snake_case` (e.g. `creator_name`, `total_bytes`). The `normalizeDataset()` function in `api/kaggle.ts` maps both camelCase and snake_case into the internal `KaggleDataset` type.

### Description enrichment

The list endpoint often omits `subtitle` and `description`. After each page load, `enrichDatasetsWithDescriptions()` fetches metadata for datasets missing descriptions, with a concurrency limit of 4 parallel requests. Failures are silent — cards simply omit the description block.

### Sort options (Discover Feed)

| Value | Label |
|-------|-------|
| `hottest` | Trending (default) |
| `votes` | Most voted |
| `updated` | Recently updated |
| `published` | Recently published |

---

## Key features

### Discover Feed

- Fetches 20 datasets per page
- Infinite scroll via `IntersectionObserver` sentinel in `DatasetGrid`
- Search (submitted on form enter) and sort dropdown
- Skeleton loading cards during fetch
- Error state with retry
- Empty state when no results or no credentials

### Dataset cards

Each card displays:

- **Title** and **creator** metadata (size, last updated)
- **Description** — 2-line clamped subtitle or description (when available)
- **Usability score** as the primary large metric
- **Download count**
- **Sparkline** — simulated trend derived deterministically from the dataset `ref` (not real historical data)
- **Performance summary** — generated copy based on simulated trend direction
- **Status badges** — vote count, trend %, "Active dataset"
- **Bookmark button** — Framer Motion scale bounce on toggle
- **Open in Browser** — links to `https://www.kaggle.com/datasets/{ref}`

> **Note:** Sparklines and performance summaries are **decorative/simulated**, not real Kaggle analytics. They are generated in `utils/format.ts` via `getDatasetTrend()` and `buildPerformanceSummary()` using a hash of the dataset ref.

### Bookmarks

- Toggle via bookmark icon on any card
- Refs stored in `localStorage`; full dataset object cached alongside
- Bookmarked tab renders cached cards in the same grid layout
- Removing a bookmark clears both the ref and cache entry

### Settings

- Username + API key form
- On save: validates credentials by calling `listDatasets` with `pageSize: 1`
- Shows connected / not configured status badge
- Clear button removes stored credentials
- Link to Kaggle settings page for obtaining API token

---

## UI / design system

### Aesthetic

Premium light-mode dashboard inspired by Tableau Pulse and modern security log UIs.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Surface background | `#F8F9FA` | Page background |
| Card background | `#FFFFFF` | Card surfaces |
| Card border | `border-gray-100` | Subtle card edges |
| Card shadow | `0 4px 30px rgba(0,0,0,0.03)` | Ambient depth |
| Positive badge | `bg-emerald-50 text-emerald-800` | Up trends, active status |
| Negative badge | `bg-red-50 text-red-800` | Down trends, errors |
| Neutral badge | `bg-slate-100 text-slate-700` | Vote counts, stable trends |

### Typography

- **Font:** Plus Jakarta Sans
- **Titles/metrics:** `text-2xl`–`text-4xl`, `font-bold`, `tracking-tight`
- **Metadata:** `text-xs`–`text-sm`, `text-gray-500`, separated by `•`

### Layout

- **Desktop:** Top nav with pill-style tab switcher; 2–3 column card grid
- **Mobile:** Compact top header; fixed bottom tab bar with safe-area padding; single-column card grid; stacked metric/sparkline sections
- **Card padding:** `p-4` mobile, `p-6` desktop

### Animations (Framer Motion)

- Tab page transitions (fade + slide)
- Staggered card entrance in grids
- Card hover lift (`y: -4`)
- Sparkline path draw on mount
- Spring-animated active nav pill (`layoutId`)
- Bookmark button scale bounce

Shared motion tokens live in `src/utils/motion.ts`.

---

## Data types

```ts
interface KaggleCredentials {
  username: string
  apiKey: string
}

interface KaggleDataset {
  ref: string                    // e.g. "zynicide/wine-reviews"
  title: string
  creatorName?: string
  ownerName?: string
  totalBytes?: number
  usabilityRating?: number
  voteCount?: number
  downloadCount?: number
  lastUpdated?: string
  subtitle?: string
  description?: string
}

type AppTab = 'discover' | 'bookmarked' | 'settings'
```

---

## How to run locally

```bash
npm install
npm run dev      # Start dev server (default http://localhost:5173)
npm run build    # TypeScript check + production build → dist/
npm run preview  # Serve production build locally
npm run lint     # oxlint
```

### First-time usage

1. Open the app
2. Go to **Settings**
3. Enter Kaggle username and API key
4. Click **Save credentials** (validates against the API)
5. Return to **Discover Feed**

---

## Known limitations

### 1. CORS (critical for deployment)

The browser cannot call `https://www.kaggle.com/api/v1` directly in production because Kaggle does not return `Access-Control-Allow-Origin` headers. This means:

- Local dev *may* work in some environments or with browser extensions
- A deployed Vercel/static site **will fail** on API calls

**Required fix:** Add a server-side proxy (e.g. Vercel Serverless Functions at `/api/kaggle/*`) that forwards requests to Kaggle and returns the response.

### 2. Credentials in localStorage

API keys are stored in plaintext in the user's browser. Acceptable for a personal BYOK tool, but for public use requires:

- Clear privacy/security disclosure in the UI
- XSS protection (CSP, no untrusted third-party scripts)
- Proxy should not log `Authorization` headers

### 3. Simulated analytics

Sparklines and performance summary text are **not real data**. They are deterministically generated from the dataset `ref` string for visual polish only.

### 4. Aggressive metadata fetching

Each page of 20 datasets can trigger up to 20 additional metadata API calls (batched at concurrency 4). This may be slow and could hit Kaggle rate limits at scale. Consider lazy-loading descriptions on demand or caching.

### 5. No URL routing

Tabs are not reflected in the URL. Refreshing loses the active tab. Deep linking is not supported.

### 6. No tests or CI

No unit, integration, or E2E tests. No GitHub Actions or deployment pipeline configured.

---

## Production readiness checklist

Items identified but **not yet implemented**:

- [ ] **Vercel serverless API proxy** for Kaggle (`/api/kaggle/[...path].ts`)
- [ ] **Vite dev proxy** mirroring production proxy behavior
- [ ] **`vercel.json`** with SPA rewrites and build config
- [ ] **Rate limiting** on the proxy
- [ ] **Error boundary** React component
- [ ] **Privacy policy / security notice** in Settings
- [ ] **README** with setup and deployment instructions
- [ ] **Reduce metadata enrichment** aggressiveness or add caching
- [ ] **CI pipeline** (build + lint on PR)
- [ ] **SEO meta tags** in `index.html`
- [ ] **Monitoring** (Sentry, Vercel Analytics)
- [ ] **Kaggle API terms** review for compliance
- [ ] Pin Node version (`.nvmrc` or `engines` in `package.json`)

---

## Deployment notes (Vercel)

The app is a static Vite SPA. Vercel deployment settings:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

The UI can be deployed as-is, but **the API will not work** until the serverless proxy is added. See the production checklist above.

---

## Dependencies

### Runtime

- `react`, `react-dom` — UI framework
- `framer-motion` — animations
- `lucide-react` — icons

### Dev

- `vite`, `@vitejs/plugin-react` — build tooling
- `tailwindcss`, `@tailwindcss/vite` — styling
- `typescript` — type checking
- `oxlint` — linting

No routing library, no state management library, no HTTP client library (uses native `fetch`), no charting library (custom SVG sparklines).

---

## Conventions for contributors

- **TypeScript** throughout; types in `src/types/`
- **Components** are functional with hooks; no class components
- **Styling** via Tailwind utility classes; design tokens in `src/index.css` `@theme`
- **API calls** isolated in `src/api/`; hooks wrap API + state logic
- **Formatting/display logic** in `src/utils/format.ts`
- **Animation config** in `src/utils/motion.ts`
- Keep changes focused; match existing naming and file organization
- Do not commit secrets (`.env` is gitignored)

---

## History / how we got here

1. Project scaffolded with Vite + React + TypeScript
2. Premium dashboard UI built with Tailwind, Lucide, Framer Motion
3. Kaggle API integration added with client-side Basic Auth
4. Three tabs implemented: Discover, Bookmarked, Settings
5. Mobile responsiveness added (bottom nav, stacked layouts, safe areas)
6. Subtle animations added (stagger, hover, sparkline draw, tab transitions)
7. Dataset descriptions added with API normalization + background metadata enrichment
8. Identified CORS as the primary blocker for public/Vercel deployment

---

*Last updated: June 2026*
