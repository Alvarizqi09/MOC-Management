interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
      aria-hidden
    />
  )
}

export function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, col) => (
        <div key={col} className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 3 - col }).map((_, row) => (
            <Skeleton key={row} className="h-28 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
