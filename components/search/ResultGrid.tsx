import type { SearchHit } from '@/lib/search/types'
import { ResultCard } from './ResultCard'

type ResultGridProps = {
  hits: SearchHit[]
}

export function ResultGrid({ hits }: ResultGridProps) {
  return (
    <ul className="gap-gutter grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hits.map((hit) => (
        <li key={hit.item.id}>
          <ResultCard item={hit.item} />
        </li>
      ))}
    </ul>
  )
}
