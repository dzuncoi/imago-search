import { SearchIndex } from '@/lib/search/index'
import type { MediaItem } from '@/lib/search/types'
import { fixtureItems as items } from './fixtures'

describe('SearchIndex.build', () => {
  it('returns an index whose size matches the input length', () => {
    const index = SearchIndex.build(items)
    expect(index.size()).toBe(2)
  })

  it('returns size 0 for an empty input', () => {
    expect(SearchIndex.build([]).size()).toBe(0)
  })

  it('preprocesses each item (datumIso + restrictions are populated)', () => {
    const idx = SearchIndex.build(items)
    const docA = idx.getDoc(1)
    expect(docA?.datumIso).toBe('1900-01-01')
    expect(docA?.restriction).toEqual({
      type: 'in',
      countries: ['GER', 'SUI', 'AUT'],
    })

    const docB = idx.getDoc(2)
    expect(docB?.datumIso).toBe('1995-11-01')
    expect(docB?.restriction).toBeNull()
  })
})

describe('SearchIndex.getDoc', () => {
  it('returns the doc at the given id', () => {
    const index = SearchIndex.build(items)
    expect(index.getDoc(1)?.bildnummer).toBe('0059987730')
    expect(index.getDoc(2)?.bildnummer).toBe('0056821849')
  })

  it('returns null for a bad id', () => {
    const index = SearchIndex.build(items)
    expect(index.getDoc(-1)).toBeNull()
    expect(index.getDoc(0)).toBeNull()
    expect(index.getDoc(999)).toBeNull()
  })
})

describe('SearchIndex.getAllDocs', () => {
  it('returns all docs in insertion order', () => {
    const index = SearchIndex.build(items)
    const all = index.getAllDocs()
    expect(all).toHaveLength(2)
    expect(all[0].bildnummer).toBe('0059987730')
    expect(all[1].bildnummer).toBe('0056821849')
  })
})

describe('SearchIndex.getPostings', () => {
  it('finds a suchtext-only token in the right doc', () => {
    const index = SearchIndex.build(items)
    expect(index.getPostings('morris', 'suchtext')).toEqual([{ docId: 1, tf: 1 }])
    expect(index.getPostings('jackson', 'suchtext')).toEqual([{ docId: 2, tf: 1 }])
  })

  it('finds a fotografen token across both docs', () => {
    const index = SearchIndex.build(items)
    expect(index.getPostings('imago', 'fotografen')).toEqual([
      { docId: 1, tf: 1 },
      { docId: 2, tf: 1 },
    ])
  })

  it('adds proper posting for tokens in proper field', () => {
    const index = SearchIndex.build(items)
    expect(index.getPostings('teutopress', 'suchtext')).toEqual([])
    expect(index.getPostings('teutopress', 'fotografen')).toEqual([{ docId: 2, tf: 1 }])
  })

  it('indexes bildnummer as a single token', () => {
    const index = SearchIndex.build(items)
    expect(index.getPostings('0059987730', 'bildnummer')).toEqual([{ docId: 1, tf: 1 }])
    expect(index.getPostings('0056821849', 'bildnummer')).toEqual([{ docId: 2, tf: 1 }])
  })

  it('returns empty for unknown tokens', () => {
    const index = SearchIndex.build(items)
    expect(index.getPostings('nonexistent', 'suchtext')).toEqual([])
  })

  it('counts term frequency when a token repeats in the same field', () => {
    const repeated: MediaItem[] = [
      {
        id: 1,
        suchtext: 'jackson jackson jackson Michael',
        bildnummer: '999',
        fotografen: 'IMAGO',
        datum: '01.11.1995',
        hoehe: '1',
        breite: '1',
      },
    ]
    const index = SearchIndex.build(repeated)
    expect(index.getPostings('jackson', 'suchtext')).toEqual([{ docId: 1, tf: 3 }])
    expect(index.getPostings('michael', 'suchtext')).toEqual([{ docId: 1, tf: 1 }])
  })
})

describe('SearchIndex.getIdf', () => {
  it('returns 0 for a token that appears in every doc', () => {
    const idx = SearchIndex.build(items)
    // "imago" is in both fotografen -> df = 2, N = 2 -> log(2/2) = 0
    expect(idx.getIdf('imago')).toBe(0)
  })

  it('returns a high value for a rare token', () => {
    const index = SearchIndex.build(items)
    // "jackson" appears in 1 of 2 docs → log(2/1) = ln(2)
    expect(index.getIdf('jackson')).toBeCloseTo(Math.log(2), 5)
  })

  it('returns 0 for an unknown token', () => {
    const idx = SearchIndex.build(items)
    expect(idx.getIdf('nonexistent')).toBe(0)
  })

  it('counts a doc once even if a token appears in multiple fields', () => {
    const cross: MediaItem[] = [
      {
        id: 1,
        suchtext: 'imago studio',
        bildnummer: '111',
        fotografen: 'IMAGO',
        datum: '01.01.2000',
        hoehe: '1',
        breite: '1',
      },
      {
        id: 2,
        suchtext: 'jackson',
        bildnummer: '222',
        fotografen: 'someone else',
        datum: '01.01.2000',
        hoehe: '1',
        breite: '1',
      },
    ]
    const index = SearchIndex.build(cross)
    // df('imago') should be 1 (only doc 0), not 2
    // N = 2, df = 1 -> idf = log(2)
    expect(index.getIdf('imago')).toBeCloseTo(Math.log(2), 5)
  })
})
