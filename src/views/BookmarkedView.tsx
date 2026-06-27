import type { KaggleDataset } from '../types/kaggle'
import { DatasetCard } from '../components/datasets/DatasetCard'
import { EmptyState } from '../components/ui/EmptyState'

interface BookmarkedViewProps {
  datasets: KaggleDataset[]
  isBookmarked: (ref: string) => boolean
  onToggleBookmark: (ref: string, dataset: KaggleDataset) => void
  onGoToDiscover: () => void
}

export function BookmarkedView({
  datasets,
  isBookmarked,
  onToggleBookmark,
  onGoToDiscover,
}: BookmarkedViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Bookmarked
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your saved datasets, ready to revisit anytime.
        </p>
      </div>

      {datasets.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Bookmark datasets from the Discover Feed to build your personal collection."
          action={
            <button
              type="button"
              onClick={onGoToDiscover}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Browse datasets
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.ref}
              dataset={dataset}
              bookmarked={isBookmarked(dataset.ref)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
