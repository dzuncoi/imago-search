'use client'

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

export const SORT_OPTIONS = ['relevance', 'date_asc', 'date_desc'] as const

export function useSearchParamsState() {
  return useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsStringLiteral(SORT_OPTIONS).withDefault('relevance'),
    page: parseAsInteger.withDefault(1),
  })
}
