import type { SortOrder, Candidate } from '@/lib/search/types'

// Give a list of candidates and a sort order
// return a new sorted list of candidates
// Note: not enough time for unit test
// should write it down in the submission

const sortCandidates = (candidates: Candidate[], order: SortOrder) => {
  return [...candidates].sort((a, b) => {
    const aDate = a.doc.datumIso
    const bDate = b.doc.datumIso

    switch (order) {
      case 'relevance': {
        if (a.score !== b.score) return b.score - a.score
        return a.docId - b.docId
      }
      case 'date_asc': {
        if (aDate === null && bDate === null) return a.docId - b.docId
        if (aDate === null) return 1
        if (bDate === null) return -1
        if (aDate !== bDate) return aDate < bDate ? -1 : 1
        return a.docId - b.docId
      }
      case 'date_desc': {
        if (aDate === null && bDate === null) return a.docId - b.docId
        if (aDate === null) return 1
        if (bDate === null) return -1
        if (aDate !== bDate) return aDate < bDate ? 1 : -1
        return a.docId - b.docId
      }
    }
  })
}

export { sortCandidates }
