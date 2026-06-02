export type MediaItem = {
  id: number
  suchtext: string
  bildnummer: string
  fotografen: string
  datum: string
  hoehe: string
  breite: string
}

export type Restriction = {
  type: 'in' | 'not_in'
  countries: string[]
}

export type IndexedMediaItem = MediaItem & {
  datumIso: string | null
  suchtextTokens: string[]
  fotografenTokens: string[]
  restriction: Restriction | null
}

export type SortOrder = 'relevance' | 'date_asc' | 'date_desc'

export type Filters = {
  credit?: string
  dateFrom?: string
  dateTo?: string
  restrictions?: string[]
}

export type Candidate = {
  doc: IndexedMediaItem
  docId: number
  score: number
}

export type SearchRequest = Filters & {
  q: string
  sort: SortOrder
  page: number
  pageSize: number
}

export type SearchHit = {
  item: MediaItem
  score: number
}

export type SearchResponse = {
  items: SearchHit[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  duration: number
}
