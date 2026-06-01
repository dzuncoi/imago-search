import { describe, it, expect } from 'vitest'
import { preprocess } from '@/lib/search/preprocess'
import type { MediaItem } from '@/lib/search/types'

import { docA, docB } from './fixtures'

describe('preprocess', () => {
  it('keeps all original MediaItem fields', () => {
    const result = preprocess(docA)
    expect(result.suchtext).toBe(docA.suchtext)
    expect(result.bildnummer).toBe(docA.bildnummer)
    expect(result.fotografen).toBe(docA.fotografen)
    expect(result.datum).toBe(docA.datum)
    expect(result.hoehe).toBe(docA.hoehe)
    expect(result.breite).toBe(docA.breite)
  })

  it('parses datum into ISO format', () => {
    expect(preprocess(docA).datumIso).toBe('1900-01-01')
    expect(preprocess(docB).datumIso).toBe('1995-11-01')
  })

  it('returns datumIso=null for unparseable dates', () => {
    const item: MediaItem = { ...docA, datum: 'foo' }
    expect(preprocess(item).datumIso).toBeNull()
  })

  it('extracts restrictions from the suchtext', () => {
    expect(preprocess(docA).restriction).toEqual({
      type: 'in',
      countries: ['GER', 'SUI', 'AUT'],
    })
    expect(preprocess(docB).restriction).toBeNull()
  })

  it('tokenizes suchtext', () => {
    const result = preprocess(docA)
    expect(result.suchtextTokens).toContain('morris')
    expect(result.suchtextTokens).toContain('manchester')
    expect(result.suchtextTokens).toContain('january')
    expect(result.suchtextTokens).toContain('1948')
  })

  it('tokenizes fotografen', () => {
    expect(preprocess(docA).fotografenTokens).toEqual([
      'imago',
      'united',
      'archives',
      'international',
    ])
    expect(preprocess(docB).fotografenTokens).toEqual(['imago', 'teutopress'])
  })

  it('handles an item with empty suchtext and fotografen', () => {
    const item: MediaItem = {
      ...docA,
      suchtext: '',
      fotografen: '',
    }
    const result = preprocess(item)
    expect(result.suchtextTokens).toEqual([])
    expect(result.fotografenTokens).toEqual([])
    expect(result.restriction).toBeNull()
  })
})
