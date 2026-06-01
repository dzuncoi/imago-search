import { parseDate } from '@/lib/search/parse-date'

describe('parseDate', () => {
  it('parses the sample date properly', () => {
    expect(parseDate('01.06.2026')).toBe('2026-06-01')
  })

  it('keeps leading zeros in the ISO output', () => {
    expect(parseDate('05.03.2024')).toBe('2024-03-05')
  })

  it('returns null for empty input', () => {
    expect(parseDate('')).toBeNull()
  })

  it('returns null for non-date input', () => {
    expect(parseDate('foo')).toBeNull()
    expect(parseDate('not a date')).toBeNull()
  })

  it('returns null for slashes instead of dots', () => {
    expect(parseDate('01/06/2026')).toBeNull()
  })

  it('returns null for an invalid month', () => {
    expect(parseDate('01.13.1995')).toBeNull()
    expect(parseDate('01.00.1995')).toBeNull()
  })

  it('returns null for an invalid day of the month', () => {
    expect(parseDate('31.02.2020')).toBeNull()
    expect(parseDate('31.04.1995')).toBeNull()
    expect(parseDate('00.01.1995')).toBeNull()
  })

  it('accepts a valid leap day', () => {
    expect(parseDate('29.02.2020')).toBe('2020-02-29')
  })

  it('rejects a leap day in a non-leap year', () => {
    expect(parseDate('29.02.2021')).toBeNull()
  })

  it('returns null for missing parts', () => {
    expect(parseDate('11.1995')).toBeNull()
    expect(parseDate('01.11')).toBeNull()
  })

  it('returns null for two-digit years', () => {
    expect(parseDate('01.11.95')).toBeNull()
  })
})
