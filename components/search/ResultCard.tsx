import type { MediaItem } from '@/lib/search/types'

type ResultCardProps = {
  item: MediaItem
}

export function ResultCard({ item }: ResultCardProps) {
  return (
    <article className="group gap-stack-sm flex flex-col">
      <div className="bg-surface-container relative aspect-3/1 w-full overflow-hidden">
        <div className="absolute top-0 right-0 left-0 flex flex-row justify-between">
          <span className="bg-primary text-label-sm text-primary-foreground px-2 py-1">
            #{item.bildnummer}
          </span>
          <span className="text-label-sm text-primary px-2 py-1">{item.datum}</span>
        </div>
      </div>

      <div className="gap-stack-sm flex flex-col">
        <p className="text-body-md text-on-surface line-clamp-2 leading-5">{item.suchtext}</p>

        <dl className="gap-stack-md text-label-sm text-on-surface-variant flex items-baseline justify-between">
          <dt className="sr-only">Photographer</dt>
          <dd className="truncate">{item.fotografen}</dd>
        </dl>
      </div>
    </article>
  )
}
