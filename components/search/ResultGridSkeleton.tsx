import { Skeleton } from '@/components/ui/skeleton'

type ResultGridSkeletonProps = {
  count?: number
}

/** Loading placeholder mirroring the result grid's layout. */
export function ResultGridSkeleton({ count = 8 }: ResultGridSkeletonProps) {
  return (
    <div
      aria-hidden
      className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-stack-sm">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-2/3 rounded-none" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-24 rounded-none" />
            <Skeleton className="h-3 w-16 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  )
}
