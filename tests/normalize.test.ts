import { it, describe, expect } from 'vitest'
import { normalize } from '@/lib/search/normalize'

describe('normalize', () => {
  it('lowercases', () => {
    expect(normalize('Dung Huynh')).toBe('dung huynh')
  })

  it('strips diacritic / accents', () => {
    expect(normalize('Müller')).toBe('muller')

    expect(normalize('café')).toBe('cafe')

    expect(normalize('Año')).toBe('ano')
  })


  it('keeps digits', () => {
    expect(normalize('J.Morris, 1948')).toBe('j.morris, 1948')
  })

  it('is idempotent', () => {
    const input = 'Müller Café Año'
    expect(normalize(normalize(input))).toBe(normalize(input))
  })

})
