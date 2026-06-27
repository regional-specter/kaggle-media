export function DatasetCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded-lg bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
        <div className="h-9 w-9 rounded-xl bg-gray-100" />
      </div>

      <div className="mt-8 flex items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-gray-100" />
          <div className="h-10 w-24 rounded-lg bg-gray-100" />
        </div>
        <div className="h-12 w-[120px] rounded-lg bg-gray-100" />
      </div>

      <div className="mt-6 space-y-2 border-t border-gray-50 pt-5">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
      </div>

      <div className="mt-5 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-100" />
        <div className="h-6 w-20 rounded-full bg-gray-100" />
        <div className="h-6 w-24 rounded-full bg-gray-100" />
      </div>
    </div>
  )
}
