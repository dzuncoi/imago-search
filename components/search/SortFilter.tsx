'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SORT_OPTIONS, type SortOption } from '@/hooks/useSearchParamsState'

const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevance',
  date_asc: 'Date ↑ (oldest)',
  date_desc: 'Date ↓ (newest)',
}

type SortFilterProps = {
  value: SortOption
  onChange: (next: SortOption) => void
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as SortOption)}>
      <SelectTrigger className="border-foreground h-10! gap-2 px-4 font-mono text-sm font-medium tracking-wide uppercase">
        <span className="text-on-surface-variant">Sort:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem
            key={option}
            value={option}
            className="font-mono text-sm tracking-wide uppercase"
          >
            {SORT_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
