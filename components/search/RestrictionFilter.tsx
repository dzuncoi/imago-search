'use client'

import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export const RESTRICTION_COUNTRIES = ['AUT', 'FRA', 'GER', 'SUI', 'USA'] as const

type RestrictionFilterProps = {
  value: string[]
  onChange: (next: string[]) => void
}

export function RestrictionFilter({ value, onChange }: RestrictionFilterProps) {
  const toggle = (country: string, checked: boolean) => {
    const next = checked ? [...value, country] : value.filter((selected) => selected !== country)
    onChange(next)
  }

  const count = value.length
  const label = count > 0 ? `Restricted in (${count})` : 'Restricted in'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-foreground h-10 justify-start gap-2 px-4 font-mono text-sm font-medium tracking-wide uppercase"
        >
          {label}
          <ChevronDownIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <ul className="flex flex-col">
          {RESTRICTION_COUNTRIES.map((country) => (
            <li key={country}>
              <label className="hover:bg-surface-container-high flex cursor-pointer items-center gap-3 px-4 py-2">
                <Checkbox
                  checked={value.includes(country)}
                  onCheckedChange={(state) => toggle(country, state === true)}
                />
                <span className="text-label-md text-on-surface">{country}</span>
              </label>
            </li>
          ))}
        </ul>
        {count > 0 && (
          <div className="border-border-muted border-t p-2">
            <Button
              variant="ghost"
              onClick={() => onChange([])}
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
