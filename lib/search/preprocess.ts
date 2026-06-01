import { extractRestriction } from './extract-restriction'
import { parseDate } from './parse-date'
import { tokenize } from './tokenize'
import type { IndexedMediaItem, MediaItem } from './types'

const preprocess = (item: MediaItem): IndexedMediaItem => {
  return {
    ...item,
    datumIso: parseDate(item.datum),
    fotografenTokens: tokenize(item.fotografen),
    suchtextTokens: tokenize(item.suchtext),
    restriction: extractRestriction(item.suchtext),
  }
}

export { preprocess }
