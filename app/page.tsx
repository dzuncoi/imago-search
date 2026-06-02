'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { SearchResponse } from '@/lib/search/types'
import { SearchBar } from '@/components/search/SearchBar'
import { ResultGrid } from '@/components/search/ResultGrid'
import { ResultGridSkeleton } from '@/components/search/ResultGridSkeleton'
import axios from 'axios'

const searchMedia = async () => {
  const res = await axios.get<SearchResponse>('/api/search')
  return res.data
}

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search'],
    queryFn: () => searchMedia(),
    placeholderData: keepPreviousData,
  })

  const hits = data?.items || []

  return (
    <main className="max-w-page px-margin-mobile py-stack-lg md:px-margin-desktop mx-auto w-full flex-1">
      <div className="gap-stack-lg flex w-full flex-col">
        <header className="gap-stack-md flex flex-col">
          <h1 className="text-display-lg-mobile md:text-display-lg">Visual Discovery</h1>
          <SearchBar isLoading={isLoading} onSearch={() => {}} />
        </header>

        <section aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <ResultGridSkeleton />
          ) : isError ? (
            <p className="text-label-md text-error" role="alert">
              Something went wrong.
            </p>
          ) : hits.length > 0 ? (
            <ResultGrid hits={hits} />
          ) : (
            <p className="text-body-lg text-on-surface-variant">Search the archive to begin.</p>
          )}
        </section>
      </div>
    </main>
  )
}
