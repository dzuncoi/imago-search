'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseAsString, useQueryState } from 'nuqs'

type SearchBarProps = {
  isLoading?: boolean
}

const SEARCH_DEBOUNCE = 250

export function SearchBar({ isLoading = false }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('')
  const [urlQ, setUrlQ] = useQueryState('q', parseAsString.withDefault(''))

  useEffect(() => {
    if (inputValue === urlQ) return
    const timer = setTimeout(() => {
      setUrlQ(inputValue)
    }, SEARCH_DEBOUNCE)

    return () => clearTimeout(timer)
  }, [inputValue, urlQ, setUrlQ])

  return (
    <form role="search" className="gap-stack-md flex w-full items-end">
      <div className="flex-1">
        <label htmlFor="search-query" className="sr-only">
          Search images
        </label>
        <Input
          id="search-query"
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Search by keyword, photographer, image number…"
          autoComplete="off"
          className="border-foreground placeholder:text-on-surface-variant focus-visible:border-foreground h-auto rounded-none border-0 border-b bg-transparent px-0 py-3 text-2xl leading-snug font-semibold shadow-none transition-[border] focus-visible:border-b-2 focus-visible:ring-0 md:text-2xl dark:bg-transparent"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || inputValue.trim().length === 0}
        className="h-12 px-8 font-mono text-sm font-medium tracking-wide uppercase"
      >
        {isLoading ? 'Searching' : 'Search'}
      </Button>
    </form>
  )
}
