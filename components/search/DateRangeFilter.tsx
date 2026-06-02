'use client'

import { type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DateRangeFilterProps = {
  from: string | null
  to: string | null
  onChange: (range: { from: string | null; to: string | null }) => void
}

const toDate = (value: string | null): Date | undefined => {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const toIsoDate = (date: Date | undefined): string | null => {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatLabel = (range: DateRange | undefined): string => {
  if (!range?.from) return 'Any date'
  if (!range.to) return format(range.from, 'd MMM yyyy')
  return `${format(range.from, 'd MMM yyyy')} – ${format(range.to, 'd MMM yyyy')}`
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const selected: DateRange | undefined =
    from || to ? { from: toDate(from), to: toDate(to) } : undefined

  const handleSelect = (range: DateRange | undefined) => {
    onChange({ from: toIsoDate(range?.from), to: toIsoDate(range?.to) })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-foreground h-10 justify-start gap-2 px-4 font-mono text-sm font-medium tracking-wide uppercase"
        >
          <CalendarIcon className="size-4" />
          {formatLabel(selected)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={selected?.from}
          selected={selected}
          onSelect={handleSelect}
          autoFocus
        />
        {selected?.from && (
          <div className="border-border-muted border-t p-2">
            <Button
              variant="ghost"
              onClick={() => onChange({ from: null, to: null })}
              className="w-full font-mono text-xs tracking-wide uppercase"
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
