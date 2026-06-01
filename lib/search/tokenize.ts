import { STOP_WORDS } from './constants'
import { normalize } from './normalize'

// \p{L}: matches any kind of letter from any language
// \p{N} matches any kind of numeric character in any script
const TOKEN_PATTERN = /[\p{L}\p{N}]+/gu
const MIN_TOKEN_LENGTH = 2

const isValidToken = (token: string) => token.length >= MIN_TOKEN_LENGTH && !STOP_WORDS.has(token)

const tokenize = (input: string): string[] => {
  const matches = input.match(TOKEN_PATTERN)
  if (!matches) return []

  return matches.filter(isValidToken).map(normalize)
}

export { tokenize }
