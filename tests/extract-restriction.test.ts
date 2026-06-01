import { extractRestriction } from '@/lib/search/extract-restriction'

describe('extractRestrictions', () => {
  it('returns null if there is no restriction', () => {
    expect(extractRestriction('Michael Jackson 1995 Pop')).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(extractRestriction('')).toBeNull()
  })

  it('extracts IN multiple countries', () => {
    const input = 'J.Morris, Manchester Utd 1948 PUBLICATIONxINxGERxSUIxAUTxONLY'
    expect(extractRestriction(input)).toEqual({
      type: 'in',
      countries: ['GER', 'SUI', 'AUT'],
    })
  })

  it('extracts IN single country', () => {
    expect(extractRestriction('foo PUBLICATIONxINxGERxONLY bar')).toEqual({
      type: 'in',
      countries: ['GER'],
    })
  })

  it('extracts NOT_IN single country', () => {
    expect(extractRestriction('foo PUBLICATIONxNOTxINxJPN bar')).toEqual({
      type: 'not_in',
      countries: ['JPN'],
    })
  })

  it('extracts NOT_IN multiple countries', () => {
    expect(extractRestriction('PUBLICATIONxNOTxINxFRAxGER')).toEqual({
      type: 'not_in',
      countries: ['FRA', 'GER'],
    })
  })

  it('handles uppercase X as separator', () => {
    expect(extractRestriction('PUBLICATIONXINXGERXSUIXONLY')).toEqual({
      type: 'in',
      countries: ['GER', 'SUI'],
    })
  })

  it('returns the positive restriction when both patterns appear', () => {
    // this should never happen with current assumption, just defensive result
    expect(extractRestriction('PUBLICATIONxINxGERxONLY PUBLICATIONxNOTxINxJPN')).toEqual({
      type: 'in',
      countries: ['GER'],
    })
  })

  it('ignores bad patterns', () => {
    expect(extractRestriction('PUBLICATIONxINxGER')).toBeNull()
    expect(extractRestriction('PUBLICATIONxINxONLY')).toBeNull()
    expect(extractRestriction('PUBLICATIONxINxgerxONLY')).toBeNull()
    expect(extractRestriction('Hello GER world')).toBeNull()
  })
})
