import type { SearchIndex } from '.'
import { applyFilters } from './filters'
import { score } from './score'
import { sortCandidates } from './sort'
import { tokenize } from './tokenize'
import type { Candidate, SearchHit, SearchRequest, SearchResponse } from './types'

const buildCandidates = (index: SearchIndex, queryTokens: string[]): Candidate[] => {
  if (queryTokens.length === 0) {
    return index.getAllDocs().map((doc) => ({ doc, docId: doc.id, score: 0 }))
  }

  const candidates: Candidate[] = []
  const scores = score(index, queryTokens)
  scores.forEach((score, docId) => {
    const doc = index.getDoc(docId)
    if (doc) candidates.push({ doc, docId, score })
  })

  return candidates
}

// Query for GET /api/search
// Receive pre-built SearchIndex, search request
// return search response
const query = (index: SearchIndex, request: SearchRequest): SearchResponse => {
  const start = performance.now()
  const { q, dateFrom, dateTo, credit, restrictions, sort, page, pageSize } = request

  const queryTokens = tokenize(q)
  const candidates = buildCandidates(index, queryTokens)

  const filtered = applyFilters(candidates, {
    dateFrom,
    dateTo,
    credit,
    restrictions,
  })

  const sorted = sortCandidates(filtered, sort)

  const total = sorted.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / request.pageSize)
  const offset = (request.page - 1) * request.pageSize
  const pageItems = sorted.slice(offset, offset + request.pageSize)

  const items: SearchHit[] = pageItems.map(({ score, doc }) => ({
    score: score,
    item: {
      id: doc.id,
      suchtext: doc.suchtext,
      bildnummer: doc.bildnummer,
      fotografen: doc.fotografen,
      datum: doc.datum,
      hoehe: doc.hoehe,
      breite: doc.breite,
    },
  }))

  return {
    duration: performance.now() - start,
    items,
    page,
    pageSize,
    total,
    totalPages,
  }
}

export { query }
