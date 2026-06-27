export function DatasetCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-4/5 rounded-lg bg-gray-100" />
          <div className="h-3 w-3/5 rounded bg-gray-100" />
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-11/12 rounded bg-gray-100" />
        </div>
        <div className="flex gap-1">
          <div className="h-9 w-9 rounded-xl bg-gray-100" />
          <div className="h-9 w-9 rounded-xl bg-gray-100" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-gray-100" />
          <div className="h-9 w-24 rounded-lg bg-gray-100 sm:h-10" />
        </div>
        <div className="h-10 w-[100px] rounded-lg bg-gray-100 sm:h-12 sm:w-[120px]" />
      </div>

      <div className="mt-5 space-y-2 border-t border-gray-50 pt-4 sm:mt-6 sm:pt-5">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-100" />
        <div className="h-6 w-24 rounded-full bg-gray-100" />
      </div>
    </div>
  )
}
