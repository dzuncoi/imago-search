# IMAGO Search

A lightweight search layer over media metadata, built with **Next.js (App Router) + TypeScript + Tailwind v4**. It exposes a `GET /api/search` endpoint backed by an **in-memory inverted index with TF-IDF scoring**, and a polished, URL-driven search UI.

---

## Table of contents

1. [Getting started](#getting-started)
2. [High-level approach & architecture overview](#high-level-approach--architecture-overview)
3. [Assumptions](#assumptions)
4. [Design decisions (search & relevance)](#design-decisions-search--relevance)
5. [Search strategy](#search-strategy-relevance--scoring--preprocessing) (relevance, scoring, preprocessing pipeline)
6. [Scaling: millions of items + continuous ingestion](#scaling-millions-of-items--continuous-ingestion)
7. [Testing approach](#testing-approach)
8. [Trade-offs](#trade-offs)
9. [Limitations & what I'd do next](#limitations--what-id-do-next)

---

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build (also type-checks)
pnpm test         # unit tests (Vitest, watch)
pnpm test:run     # unit tests (CI/one-shot)
pnpm lint         # eslint
```

---

## High-level approach & architecture overview

The system has three decoupled layers, all in one Next.js app:

```
                 ┌────────────────────────────────────────────────┐
  Browser        │  app/page.tsx  (client)                        │
                 │   • nuqs  -> URL is the single source of truth │
                 │     (q, sort, page, dateFrom/To, restrictions, │
                 │      credit)                                   │
                 │   • React Query -> fetch + cache               │
                 │   • presentational filter components           │
                 └───────────────┬────────────────────────────────┘
                                 │  GET /api/search?<params>
                                 ▼
                 ┌──────────────────────────────────────────────┐
  API route      │  app/api/search/route.ts                     │
                 │   • zod validate query params                │
                 │   • query(index, request)                    │
                 │  app/api/facets/route.ts                     │
                 │   • distinct credits for the dropdown        │
                 └───────────────┬──────────────────────────────┘
                                 │
                                 ▼
                 ┌────────────────────────────────────────────────┐
  Search core    │  lib/search/*                                  │
  (in-memory)    │   SearchIndex (inverted index, built once)     │
                 │   tokenize -> score (TF-IDF) -> filter -> sort │
                 │   -> paginate                                  │
                 └────────────────────────────────────────────────┘
```

**Key idea:** the search core (`lib/search`) is designed as a set of small, pure modules with **no Next.js or React dependencies**. The HTTP layer is a thin adapter, the UI layer is fully decoupled and talks only to the JSON API.

**Request pipeline**:

- `tokenize(q)`
- build candidates (scored postings, or all docs for an empty query)
- `applyFilters` (credit / date / restrictions)
- `sortCandidates` (relevance | date)
- slice for pagination.

Per-request timing is measured with `performance.now()` and returned as `duration`.

### API contract

`GET /api/search`

| Param                 | Type                                     | Default     | Notes                                                        |
| --------------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------ |
| `q`                   | string                                   | `''`        | empty `q` = browse mode (all docs, filters/sort still apply) |
| `credit`              | string                                   |             | string match on `fotografen`                                 |
| `dateFrom` / `dateTo` | `YYYY-MM-DD`                             |             | inclusive range on the normalized ISO date                   |
| `restrictions`        | comma-separated codes                    |             | e.g. `GER,AUT`                                               |
| `sort`                | `relevance` \| `date_asc` \| `date_desc` | `relevance` |                                                              |
| `page`                | int ≥ 1                                  | `1`         |                                                              |
| `pageSize`            | int 1–100                                | `20`        |                                                              |

Response (`SearchResponse`):

```jsonc
{
  "items": [
    {
      "item": {
        /* MediaItem */
      },
      "score": 12.34,
    },
  ],
  "page": 1,
  "pageSize": 20,
  "total": 137,
  "totalPages": 7,
  "duration": 0.42, // milliseconds
}
```

Invalid params return `400` with a zod error. `GET /api/facets` returns the distinct, sorted list of credits for the dropdown.

### Tech stack & notable choices

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind v4** + **shadcn/ui** for accessible primitives
- **nuqs** for type-safe URL search-param state (every filter is bookmarkable/shareable, back/forward works)
- **TanStack React Query** for fetching & caching
- **zod** for API input validation
- **Vitest** for unit tests of the search core

### Frontend state model

With this application, the URL is designed as the single source of truth. The hook `useSearchParamsState` (`hooks/useSearchParamsState.ts`), owns all params via `nuqs` `useQueryStates`. Filter components are **presentational** (`value` in, `onChange` out). React Query is keyed on the full query string, so any URL change triggers exactly one refetch. UI states (loading / empty / error) are explicit, and controls use labels, focus states, and keyboard-friendly primitives.

---

## Assumptions

These are the assumptions baked into the implementation.

**Data shape & metadata**

- **At most one restriction block per item** — each `suchtext` contains a single restriction clause that is either positive (`PUBLICATIONxINx...xONLY`), negative (`PUBLICATIONxNOTxINx...`), or none. There is no item with both kinds at once.
- **`datum` is always `DD.MM.YYYY`.** Parsing is **strict**: anything that doesn't match the pattern, or isn't a real calendar date, becomes `null`
- **Restriction codes are 3-letter uppercase country codes** (`[A-Z]{3}`), `x`/`X`-delimited.
- **`bildnummer` is treated as a single exact token**, not tokenized — so it matches exactly, not by prefix/substring.
- **`hoehe` / `breite` are opaque display strings** — surfaced in results but not searched or filtered.

**Scale & runtime**

- **The dataset is finite and small enough to fit in memory** (10k items here). The whole index lives in one Node process's heap and is rebuilt on cold start. This assumption is what the [scaling section](#scaling-millions-of-items--continuous-ingestion) explicitly addresses for the millions-of-items case.

**Text handling**

- **Latin-script normalization is sufficient.** Normalization lowercases and strips diacritics (NFD + remove combining marks) so "Bühne" ~= "buhne".
- **Stop-word removal targets only English + German**

---

## Design decisions (search & relevance)

### Inverted index + TF-IDF

TF-IDF is the **simplest model that gives relevant, explainable ranking** with zero dependencies. It keeps the relevance logic explicit and reviewable and can be easily swap with a production engine later.

### Three searchable fields, separately indexed

`suchtext` (primary), `fotografen` (secondary), `bildnummer` (optional/exact). Indexing **per field** lets us apply different weights at score time and keeps the posting lists small.

### Filtering semantics

- **credit**: string match on `fotografen` (single value).
- **date**: inclusive `dateFrom`/`dateTo` range on the normalized ISO date; items with no parseable date are **excluded** when a date filter is active (never silently included).
- **restrictions**: a set against restrictions extracted at index time. An item **with no restriction always passes**. An `in`-type item passes if **any** of its allowed countries is in the selected set; a `not_in`-type item passes if **none** of its forbidden countries is selected.

---

## Search strategy (relevance, scoring & preprocessing)

### Preprocessing pipeline

All preprocessing happens **once, at index-build time** (`lib/search/preprocess.ts` → `lib/search/index.ts`), turning each raw `MediaItem` into an `IndexedMediaItem`:

| Step                                                  | What                                                                                                      | Why it helps                                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Normalization** (`normalize.ts`)                    | lowercase + Unicode `NFD` + strip diacritics                                                              | "Bühne" and "buhne" match; casing differences disappear                                               |
| **Tokenization** (`tokenize.ts`)                      | Unicode-aware `\p{L}\p{N}` tokens, min length 2, English + German stop-word removal                       | splits `suchtext` into meaningful terms; drops noise words in both languages                          |
| **Date parsing** (`parse-date.ts`)                    | `DD.MM.YYYY` -> validated `YYYY-MM-DD`, else `null`                                                       | ISO strings sort and range-compare **lexicographically**, so date sort/filter needs no `Date` objects |
| **Restriction extraction** (`extract-restriction.ts`) | regex over `suchtext` for `PUBLICATIONxINx...xONLY` / `PUBLICATIONxNOTxINx...` -> `{ type, countries[] }` | turns an unstructured token into a structured, filterable field                                       |
| **Inverted index** (`index.ts`)                       | per-field token -> postings + global doc frequency                                                        | allows O(1) term lookups instead                                                                      |

**Where it happens:** build/startup time (cold start), `O(n)` over the dataset, logged with a build-duration message. At query time, app only does lookups + scoring + a filter/sort pass over the candidate set.

The index stores, per `(token, field)`, a posting list of `{ docId, tf }`, plus a global `docFrequency` map (how many documents contain each token, for IDF).

### Relevance / scoring

Scoring is **TF-IDF with field weights** (`lib/search/score.ts`):

```
score(doc) = Σ_tokens Σ_fields  tf(token, field, doc) × idf(token) × weight(field)
```

- **`tf`**: raw term frequency from the posting list.
- **`idf`**: `log(N / df)` where `N` is the dataset size and `df` is the global document frequency. Rare terms contribute more; common terms (e.g. "imago") contribute less.
- **`weight(field)`**: `suchtext: 1.0`, `fotografen: 0.6`, `bildnummer: 0.3`. A match in the descriptive text outranks a match in the credit, which outranks an image-number match.
- A document scores if **any** query token hits **any** field (OR semantics); its score is the sum of all contributions.
- **Empty query = browse mode:** every document becomes a candidate with score `0`, so filters and sorting still work with no keywords.

### Sorting (`lib/search/sort.ts`)

- **`relevance`**: score descending, tie-broken by `docId` for deterministic, stable output.
- **`date_asc` / `date_desc`**: by normalized ISO date; documents with an **unparseable date are pushed to the end** in both directions.

---

## Scaling: millions of items + continuous ingestion

**The strategy: use a managed search engine.** At production scale, the right move is to replace the in-memory index with a hosted search service — **Typesense, Meilisearch, or Algolia** (or even OpenSearch/Elasticsearch if more control is needed). These solve the genuinely hard, infrastructure-heavy problems for us — sharding, replication, relevance, and operations. Out of the box they provide exactly what the brief needs:

- keyword search with **typo tolerance + prefix matching** (this also fixes the "chel" -> "Chelsea" limitation below)
- filters (credit, date range, restrictions) and **facets**
- sorting, pagination, and millisecond queries at millions of items

It will looks like this when scaling:

```
Today:   /api/search -> query(inMemoryIndex, req) -> SearchResponse
Prod:    /api/search -> searchService.search(req) -> SearchResponse
```

**Continuous ingestion ("new items every minute") becomes trivial.** No queue or pipeline needed: when an item is created, the backend calls the service's "index document" API (`upsert`), and it's searchable within seconds.

```
new item created  ->  backend  ->  searchService.collection('media').upsert(item)
```

---

## Testing approach

The search core has no framework dependencies, so it's tested directly with **Vitest**. Current coverage (`tests/`):

- `normalize`, `tokenize` — text handling and stop-word/min-length rules
- `parse-date` — strict `DD.MM.YYYY` → ISO, invalid-date rejection
- `extract-restriction` — `in` / `not_in` / none, multi-country codes
- `preprocess`, `search-index` — end-to-end build of an `IndexedMediaItem` and the inverted index

**Next:** add unit tests for `score`, `sort`, and `filters`, one API-route integration test against `/api/search`, and a couple of UI tests for the filter <-> URL params update.

---

## Limitations & what I'd do next

**Search quality**

- **Full-token matching only — no subtext/partial matching.** If `suchtext` is "Chelsea football club ...", searching "Chelsea" matches but "chel" does **not**. **Next:** add edge n-grams (prefix) or even a trigram pass for substring/typo tolerance.
- Scoring is plain TF-IDF. **Next:** move to **BM25** with per-field statistics.
- No snippet **highlighting** of the matching `suchtext`. **Next:** return match offsets and highlight in the result card.
- Work with designer to decide if it's better to fetch new data when user scroll to bottom, instead of pagination.

**Data & UI**

- **Restriction country values are hardcoded in the UI** (a fixed multi-select of codes) rather than derived from the data. Credits are processed via `/api/facets`; restrictions should follow the same pattern (a facet endpoint over the extracted `restriction.countries`).
- Credits are filtered by single value. **Next**: should allow to filter by multiple credits.
- Restriction extraction assumes one clause per item and 3-letter codes; messy or multi-clause metadata may be mis-parsed.
- Date parsing assumes `DD.MM.YYYY`; anything else becomes `null` and is excluded from date filters / sorted to the end.
