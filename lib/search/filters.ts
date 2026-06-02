import type { Candidate, Filters } from '@/lib/search/types'

// Give a list of candidates and set of filters
// return those that match the filters

const applyFilters = (candidates: Candidate[], filters: Filters): Candidate[] => {
  const { credit, dateTo, dateFrom, restrictions } = filters

  const restrictionSet = restrictions !== undefined ? new Set(restrictions) : null

  return candidates.filter((candidate) => {
    const { doc } = candidate

    if (credit !== undefined && !doc.fotografen.includes(credit)) return false
    if (dateFrom !== undefined || dateTo !== undefined) {
      if (doc.datumIso === null) return false // don't return doc with bad-format date if user filter by date from-to
      if (dateFrom !== undefined && doc.datumIso < dateFrom) return false
      if (dateTo !== undefined && doc.datumIso > dateTo) return false
    }

    if (restrictionSet) {
      if (doc.restriction === null) return true
      if (doc.restriction.type === 'in') {
        return doc.restriction.countries.some((country) => restrictionSet.has(country))
      }
      if (doc.restriction.type === 'not_in') {
        return doc.restriction.countries.every((country) => !restrictionSet.has(country))
      }
    }

    return true
  })
}

export { applyFilters }
