'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchBarProps = {
  initialQuery?: string
  isLoading?: boolean
  onSearch: (query: string) => void
}

/**
 * Editorial search bar: a prominent full-width field with a black bottom
 * border that thickens on focus, paired with a solid-black uppercase button.
 */
export function SearchBar({ initialQuery = '', isLoading = false, onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="gap-stack-md flex w-full items-end">
      <div className="flex-1">
        <label htmlFor="search-query" className="sr-only">
          Search images
        </label>
        <Input
          id="search-query"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by keyword, photographer, image number…"
          autoComplete="off"
          className="border-foreground placeholder:text-on-surface-variant focus-visible:border-foreground h-auto rounded-none border-0 border-b bg-transparent px-0 py-3 text-2xl leading-snug font-semibold shadow-none transition-[border] focus-visible:border-b-2 focus-visible:ring-0 md:text-2xl dark:bg-transparent"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || value.trim().length === 0}
        className="h-12 px-8 font-mono text-sm font-medium tracking-wide uppercase"
      >
        {isLoading ? 'Searching' : 'Search'}
      </Button>
    </form>
  )
}
