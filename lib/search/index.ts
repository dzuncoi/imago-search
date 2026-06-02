/*
 *docs[]
    [0] = IndexedMediaItem { bildnummer: "0059987730", suchtext: "...", tokens:

  fieldIndexes
    suchtext: Map
      "morris"      -> [ {docId: 0, tf: 1} ]
      "manchester"  -> [ {docId: 0, tf: 1} ]
    fotografen: Map
      "imago"        -> [ {docId: 0, tf: 1}, {docId: 1, tf: 1} ]
      "united"       -> [ {docId: 0, tf: 1} ]
    bildnummer: Map
      "0059987730"   -> [ {docId: 0, tf: 1} ]
      "0056821849"   -> [ {docId: 1, tf: 1} ]

  docFrequency: Map
    ├─ "morris"     → 1
    ├─ "imago"      → 2  
 */

/*
 *     Normal index:                       Inverted index:
     doc 1 → [a, b, c]            "a"     → [doc 1, doc 3]     
     doc 2 → [b, d]               "b"     → [doc 1, doc 2]    
     doc 3 → [a, e]               "c"     → [doc 1]          
     doc 4 → [f]                  "d"     → [doc 2]            
                                  "e"     → [doc 3]            
                                  "f"     → [doc 4]            
*/
import seed from '@/lib/data/seed.json'
import { preprocess } from './preprocess'
import type { IndexedMediaItem, MediaItem } from './types'

export type FieldName = 'suchtext' | 'fotografen' | 'bildnummer'

export type Posting = {
  docId: number
  tf: number
}

type FieldIndex = Map<string, Posting[]>

/*
 * SearchIndex solve:
 * 1. Which docs contain this tokens (in this field)
 * E.g: for a query "michael jackson" -> return a list of Posting [ {docId: 0, tf: 1} ] per field (suchtext | fotografen ...)
 * 2. Attach TF-IDF to each tokens per field
 */
export class SearchIndex {
  constructor(
    private docs: Map<number, IndexedMediaItem>,
    private fieldIndexes: Record<FieldName, FieldIndex>,
    private docFrequency: Map<string, number>,
  ) {}

  static build(items: MediaItem[]): SearchIndex {
    const docs = new Map<number, IndexedMediaItem>()
    const docFrequency = new Map<string, number>()
    const fieldIndexes: Record<FieldName, FieldIndex> = {
      suchtext: new Map(),
      fotografen: new Map(),
      bildnummer: new Map(),
    }

    items.forEach((doc) => {
      const processed = preprocess(doc)
      docs.set(processed.id, processed)

      addFieldPosting(fieldIndexes.suchtext, processed.id, processed.suchtextTokens)
      addFieldPosting(fieldIndexes.fotografen, processed.id, processed.fotografenTokens)
      addFieldPosting(fieldIndexes.bildnummer, processed.id, [processed.bildnummer])

      const uniqueTokens = new Set<string>([
        ...processed.suchtextTokens,
        ...processed.fotografenTokens,
        processed.bildnummer,
      ])
      uniqueTokens.forEach((token) => {
        docFrequency.set(token, (docFrequency.get(token) ?? 0) + 1)
      })
    })

    return new SearchIndex(docs, fieldIndexes, docFrequency)
  }

  getDoc(docId: number): IndexedMediaItem | null {
    return this.docs.get(docId) ?? null
  }

  getAllDocs(): IndexedMediaItem[] {
    return [...this.docs.values()]
  }

  size(): number {
    return this.docs.size
  }

  getPostings(token: string, field: FieldName): Posting[] {
    return this.fieldIndexes[field].get(token) ?? []
  }

  getIdf(token: string): number {
    const df = this.docFrequency.get(token) ?? 0
    if (df === 0 || this.docs.size === 0) return 0
    return Math.log(this.docs.size / df)
  }
}

const addFieldPosting = (index: FieldIndex, docId: number, tokens: string[]) => {
  const tfMap = new Map<string, number>()
  tokens.forEach((token) => {
    tfMap.set(token, (tfMap.get(token) ?? 0) + 1)
  })

  tfMap.forEach((count, token) => {
    const existingPosting = index.get(token)
    if (existingPosting) {
      existingPosting.push({ tf: count, docId })
    } else {
      index.set(token, [{ tf: count, docId }])
    }
  })
}

let cached: SearchIndex | null = null
const getIndex = () => {
  if (cached !== null) return cached

  const start = performance.now()
  cached = SearchIndex.build(seed)
  const duration = performance.now() - start
  console.log(`Search index built ${cached.size()} in: ${duration.toFixed(1)}ms`)

  return cached
}

export { getIndex }
