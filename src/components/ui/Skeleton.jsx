function Skeleton({ className = '', width, height }) {
  return (
    <div
      className={`bg-surface animate-pulse rounded-xl ${className}`}
      style={{ width, height }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-canvas border border-hairline-soft">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  )
}

export default Skeleton
