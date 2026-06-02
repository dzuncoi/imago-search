'use client'

import { Suspense, useCallback } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { SearchResponse } from '@/lib/search/types'
import { SearchBar } from '@/components/search/SearchBar'
import { ResultGrid } from '@/components/search/ResultGrid'
import { ResultGridSkeleton } from '@/components/search/ResultGridSkeleton'
import { Pagination } from '@/components/search/Pagination'
import { DateRangeFilter } from '@/components/search/DateRangeFilter'
import { RestrictionFilter } from '@/components/search/RestrictionFilter'
import { useSearchParamsState } from '@/hooks/useSearchParamsState'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'

const searchMedia = async (queryString?: string) => {
  const res = await axios.get<SearchResponse>(`/api/search?${queryString}`)
  return res.data
}

function SearchPage() {
  const urlParams = useSearchParams()
  const queryString = urlParams.toString()

  // Single owner of the URL params; writes here update `queryString` -> refetch.
  const [{ q, dateFrom, dateTo, restrictions }, setParams] = useSearchParamsState()

  const handleQueryChange = useCallback(
    (next: string) => setParams({ q: next, page: 1 }),
    [setParams],
  )
  const handlePageChange = useCallback(
    (page: number) => setParams({ page }),
    [setParams],
  )
  const handleDateRangeChange = useCallback(
    ({ from, to }: { from: string | null; to: string | null }) =>
      setParams({ dateFrom: from, dateTo: to, page: 1 }),
    [setParams],
  )
  const handleRestrictionsChange = useCallback(
    (next: string[]) => setParams({ restrictions: next, page: 1 }),
    [setParams],
  )

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['search', queryString],
    queryFn: () => searchMedia(queryString),
    placeholderData: keepPreviousData,
  })

  const hits = data?.items || []

  return (
    <main className="max-w-page px-margin-mobile py-stack-lg md:px-margin-desktop mx-auto w-full flex-1">
      <div className="gap-stack-lg flex w-full flex-col">
        <header className="gap-stack-md flex flex-col">
          <h1 className="text-display-lg-mobile md:text-display-lg">Imago Images</h1>
          <SearchBar value={q} onChange={handleQueryChange} isLoading={isLoading} />
          <div className="gap-stack-sm flex flex-wrap">
            <DateRangeFilter from={dateFrom} to={dateTo} onChange={handleDateRangeChange} />
            <RestrictionFilter value={restrictions} onChange={handleRestrictionsChange} />
          </div>
        </header>

        <section aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <ResultGridSkeleton />
          ) : isError ? (
            <p className="text-label-md text-error" role="alert">
              Something went wrong.
            </p>
          ) : hits.length > 0 ? (
            <div className="gap-stack-lg flex flex-col">
              <ResultGrid hits={hits} />
              {data && <Pagination meta={data} onPageChange={handlePageChange} isFetching={isFetching} />}
            </div>
          ) : (
            <p className="text-body-lg text-on-surface-variant">Search the archive to begin.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="max-w-page px-margin-mobile py-stack-lg md:px-margin-desktop mx-auto w-full flex-1">
          <div className="gap-stack-lg flex w-full flex-col">
            <h1 className="text-display-lg-mobile md:text-display-lg">Imago Images</h1>
            <ResultGridSkeleton />
          </div>
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  )
}
