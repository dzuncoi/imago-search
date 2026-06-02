'use client'

import type { PaginationMeta } from '@/lib/search/types'
import { Button } from '@/components/ui/button'

type PaginationProps = {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  isFetching?: boolean
}

const CONTROL_CLASS =
  'border-foreground h-10 px-6 font-mono text-sm font-medium tracking-wide uppercase'

export function Pagination({ meta, onPageChange, isFetching = false }: PaginationProps) {
  const { page, pageSize, total, totalPages } = meta

  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const canGoPrev = page > 1
  const canGoNext = page < totalPages

  return (
    <nav
      aria-label="Pagination"
      className="border-border-muted gap-stack-md pt-stack-md flex items-center justify-between border-t"
    >
      <Button
        type="button"
        variant="outline"
        disabled={!canGoPrev || isFetching}
        onClick={() => onPageChange(page - 1)}
        className={CONTROL_CLASS}
      >
        Prev
      </Button>

      <p className="text-label-sm text-on-surface-variant" aria-live="polite">
        {from}–{to} of {total}
      </p>

      <Button
        type="button"
        variant="outline"
        disabled={!canGoNext || isFetching}
        onClick={() => onPageChange(page + 1)}
        className={CONTROL_CLASS}
      >
        Next
      </Button>
    </nav>
  )
}
