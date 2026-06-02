'use client'

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'

export const SORT_OPTIONS = ['relevance', 'date_asc', 'date_desc'] as const

export function useSearchParamsState() {
  return useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsStringLiteral(SORT_OPTIONS).withDefault('relevance'),
    page: parseAsInteger.withDefault(1),
    // Stored as YYYY-MM-DD strings to match the API schema (and avoid UTC drift).
    dateFrom: parseAsString,
    dateTo: parseAsString,
    // Restricted-in country codes, serialized as `?restrictions=GER,USA`.
    restrictions: parseAsArrayOf(parseAsString).withDefault([]),
    // Single credit (fotografen), substring-matched by the API.
    credit: parseAsString,
  })
}
