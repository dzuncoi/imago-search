import type { NextRequest } from 'next/server'
import { parseSearchParams } from '@/lib/search/parse-search-params'
import { query } from '@/lib/search/query'
import { getIndex } from '@/lib/search'

export async function GET(request: NextRequest) {
  const parsed = parseSearchParams(request.nextUrl.searchParams)
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }
  const index = getIndex()
  const response = query(index, parsed.value)
  return Response.json(response)
}
