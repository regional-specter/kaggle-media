import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search } from 'lucide-react'
import type { KaggleCredentials, KaggleDataset } from '../types/kaggle'
import { useDatasets } from '../hooks/useDatasets'
import { DatasetGrid } from '../components/datasets/DatasetGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { staggerContainer } from '../utils/motion'

interface DiscoverFeedProps {
  credentials: KaggleCredentials
  hasCredentials: boolean
  isBookmarked: (ref: string) => boolean
  onToggleBookmark: (ref: string, dataset: KaggleDataset) => void
  onGoToSettings: () => void
}

const sortOptions = [
  { value: 'hottest', label: 'Trending' },
  { value: 'votes', label: 'Most voted' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'published', label: 'Recently published' },
]

export function DiscoverFeed({
  credentials,
  hasCredentials,
  isBookmarked,
  onToggleBookmark,
  onGoToSettings,
}: DiscoverFeedProps) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('hottest')

  const { datasets, loading, loadingMore, error, hasMore, refresh, loadMore } =
    useDatasets({
      credentials,
      enabled: hasCredentials,
      search: query,
      sortBy,
    })

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setQuery(search.trim())
  }

  if (!hasCredentials) {
    return (
      <EmptyState
        title="Connect your Kaggle account"
        description="Add your username and API key in Settings to browse the latest datasets from Kaggle's catalog."
        action={
          <button
            type="button"
            onClick={onGoToSettings}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Go to Settings
          </button>
        }
      />
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <motion.div
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Discover Feed
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Explore trending datasets with live metadata from Kaggle.
          </p>
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center lg:w-auto"
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets…"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-card outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-900/5"
            />
          </form>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-card outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-900/5 sm:w-auto"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </motion.div>
      </motion.div>

      {error && !loading ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : datasets.length === 0 && !loading ? (
        <EmptyState
          title="No datasets found"
          description="Try adjusting your search query or sort order to discover more datasets."
        />
      ) : (
        <DatasetGrid
          datasets={datasets}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          credentials={credentials}
          lazyLoadDescriptions
        />
      )}
    </div>
  )
}
