import type { Restriction } from './types'

const IN_RESTRICTION = /PUBLICATION[xX]IN[xX]([A-Z]{3}(?:[xX][A-Z]{3})*)[xX]ONLY/
const NOT_IN_RESTRICTION = /PUBLICATION[xX]NOT[xX]IN[xX]([A-Z]{3}(?:[xX][A-Z]{3})*)/

// Note: we assume 1 item has only 1 kind of restriction, either IN or NOT_IN or NONE
// there is no case of "... PUBLICATIONxNOTxINxJPN PUBLICATIONxINxGERxONLY"
// TODO: should write down this assumption in the submission
const extractRestriction = (input: string): Restriction | null => {
  const inMatches = input.match(IN_RESTRICTION)
  if (inMatches) {
    return {
      type: 'in',
      countries: inMatches[1].split(/[xX]/).map((country) => country.toUpperCase()),
    }
  }

  const notInMatches = input.match(NOT_IN_RESTRICTION)
  if (notInMatches) {
    return {
      type: 'not_in',
      countries: notInMatches[1].split(/[xX]/).map((country) => country.toUpperCase()),
    }
  }
  return null
}

export { extractRestriction }
