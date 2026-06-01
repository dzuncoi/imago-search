import { tokenize } from '@/lib/search/tokenize'

describe('tokenize', () => {
  it('returns empty array for empty input', () => {
    expect(tokenize('')).toEqual([])
  })

  it('splits on whitespace', () => {
    expect(tokenize('michael jackson musik')).toEqual(['michael', 'jackson', 'musik'])
  })

  it('splits on punctuation', () => {
    expect(tokenize('CJ.Morris, Manchester')).toEqual(['cj', 'morris', 'manchester'])
  })

  it('drops tokens shorter than 2 characters', () => {
    expect(tokenize('a b cd e fg 1 234 5')).toEqual(['cd', 'fg', '234'])
  })

  it('drops stop words', () => {
    expect(tokenize('the quick brown fox')).toEqual(['quick', 'brown', 'fox'])
    expect(tokenize('die musik und der pop')).toEqual(['musik', 'pop'])
  })

  it('lowercases and strips diacritics', () => {
    expect(tokenize('Bühne Köln')).toEqual(['buhne', 'koln'])
  })

  it('keeps the long restriction token', () => {
    expect(tokenize('PUBLICATIONxINxGERxSUIxAUTxONLY')).toEqual(['publicationxinxgerxsuixautxonly'])
  })
})
