'use client'

import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'

type CreditFilterProps = {
  value: string | null
  onChange: (next: string | null) => void
}

export function CreditFilter({ value, onChange }: CreditFilterProps) {
  const [open, setOpen] = useState(false)
  const { data: credits = [], isLoading } = useCredits()

  function handleSelect(credit: string) {
    // Re-selecting the active credit clears it.
    onChange(credit === value ? null : credit)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-foreground h-10 w-56 justify-between gap-2 px-4 font-mono text-sm font-medium tracking-wide uppercase"
        >
          <span className="truncate">{value ?? 'Credit'}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <Command loop>
          <CommandInput placeholder="Search credit…" />
          <CommandList>
            <CommandEmpty>{isLoading ? 'Loading…' : 'No credit found.'}</CommandEmpty>
            <CommandGroup>
              {credits.map((credit) => (
                <CommandItem key={credit} value={credit} onSelect={() => handleSelect(credit)}>
                  <CheckIcon
                    className={cn('size-4', value === credit ? 'opacity-100' : 'opacity-0')}
                  />
                  {credit}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {value && (
          <div className="border-border-muted border-t p-2">
            <Button
              variant="ghost"
              onClick={() => handleSelect(value)}
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
