import { z } from 'zod'
import type { SearchRequest } from '@/lib/search/types'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

const SearchParamsSchema = z.object({
  q: z.string().default(''),
  credit: z.string().optional(),
  dateFrom: z.string().regex(ISO_DATE, 'dateFrom must be YYYY-MM-DD').optional(),
  dateTo: z.string().regex(ISO_DATE, 'dateTo must be YYYY-MM-DD').optional(),
  restrictions: z
    .string()
    .optional()
    .transform((s) =>
      s
        ? s
            .split(', ')
            .map((x) => x.trim())
            .filter(Boolean)
        : undefined,
    ),
  sort: z.enum(['relevance', 'date_asc', 'date_desc']).default('relevance'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type ParseResult = { ok: true; value: SearchRequest } | { ok: false; error: string }

const formatZodError = (error: z.ZodError): string => {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join('; ')
}

const parseSearchParams = (params: URLSearchParams): ParseResult => {
  const raw = Object.fromEntries(params)
  const parsed = SearchParamsSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: formatZodError(parsed.error) }
  }
  return { ok: true, value: parsed.data }
}

export { parseSearchParams }
