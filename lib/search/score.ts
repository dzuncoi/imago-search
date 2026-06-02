import type { SearchIndex, FieldName } from '.'

const DEFAULT_WEIGHTS: Record<FieldName, number> = {
  suchtext: 1.0,
  fotografen: 0.6,
  bildnummer: 0.3,
}

const FIELDS: FieldName[] = ['suchtext', 'fotografen', 'bildnummer']

// Given an index and list of query tokens
// return Map<docId, score> for every doc
// that has at least 1 token in at least 1 field
const score = (
  index: SearchIndex,
  tokens: string[],
  weights: typeof DEFAULT_WEIGHTS = DEFAULT_WEIGHTS,
): Map<number, number> => {
  const scores = new Map<number, number>()

  tokens.forEach((token) => {
    const idf = index.getIdf(token)
    FIELDS.forEach((field) => {
      const weight = weights[field]
      const postings = index.getPostings(token, field)
      postings.forEach((posting) => {
        const contribution = posting.tf * idf * weight
        scores.set(posting.docId, (scores.get(posting.docId) ?? 0) + contribution)
      })
    })
  })

  return scores
}

export { score }
