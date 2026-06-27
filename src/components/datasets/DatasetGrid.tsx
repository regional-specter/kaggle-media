import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { KaggleDataset } from '../../types/kaggle'
import { staggerContainer } from '../../utils/motion'
import { DatasetCard } from './DatasetCard'
import { DatasetCardSkeleton } from './DatasetCardSkeleton'

interface DatasetGridProps {
  datasets: KaggleDataset[]
  loading: boolean
  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  isBookmarked: (ref: string) => boolean
  onToggleBookmark: (ref: string, dataset: KaggleDataset) => void
  skeletonCount?: number
}

export function DatasetGrid({
  datasets,
  loading,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  isBookmarked,
  onToggleBookmark,
  skeletonCount = 6,
}: DatasetGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || !onLoadMore || loading || loadingMore) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore, loading, loadingMore])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <DatasetCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {datasets.map((dataset, index) => (
          <DatasetCard
            key={dataset.ref}
            dataset={dataset}
            bookmarked={isBookmarked(dataset.ref)}
            onToggleBookmark={onToggleBookmark}
            index={index}
          />
        ))}
      </motion.div>

      {loadingMore && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <DatasetCardSkeleton key={i} />
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden />}
    </>
  )
}
