import { motion } from 'framer-motion'
import { Bookmark, ExternalLink } from 'lucide-react'
import type { KaggleDataset } from '../../types/kaggle'
import {
  buildPerformanceSummary,
  formatBytes,
  formatCount,
  formatDate,
  formatRating,
  getCreatorName,
  getDatasetDescription,
  getDatasetTrend,
  getKaggleDatasetUrl,
} from '../../utils/format'
import { easeTransition } from '../../utils/motion'
import { StatusBadge } from '../ui/StatusBadge'
import { Sparkline } from './Sparkline'

interface DatasetCardProps {
  dataset: KaggleDataset
  bookmarked: boolean
  onToggleBookmark: (ref: string, dataset: KaggleDataset) => void
  index?: number
}

export function DatasetCard({
  dataset,
  bookmarked,
  onToggleBookmark,
  index = 0,
}: DatasetCardProps) {
  const creator = getCreatorName(dataset)
  const trend = getDatasetTrend(dataset.ref)
  const summary = buildPerformanceSummary(dataset, dataset.ref)
  const description = getDatasetDescription(dataset)
  const primaryMetric = formatRating(dataset.usabilityRating)
  const metricLabel = 'Usability Score'

  return (
    <motion.article
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ ...easeTransition, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition-shadow hover:border-gray-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />

      <header className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-gray-900 sm:text-[1.05rem]">
            {dataset.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 sm:text-sm">
            <span className="font-medium text-gray-700">{creator}</span>
            <span className="hidden text-gray-300 sm:inline">•</span>
            <span>{formatBytes(dataset.totalBytes)}</span>
            <span className="text-gray-300">•</span>
            <span className="whitespace-nowrap">Updated {formatDate(dataset.lastUpdated)}</span>
          </div>

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500"
            >
              {description}
            </motion.p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            animate={bookmarked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => onToggleBookmark(dataset.ref, dataset)}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              bookmarked
                ? 'border-amber-200 bg-amber-50 text-amber-600'
                : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-600'
            }`}
          >
            <Bookmark
              className="h-4 w-4"
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </motion.button>

          <motion.a
            href={getKaggleDatasetUrl(dataset.ref)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in browser"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400 transition-colors hover:border-gray-200 hover:text-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
          </motion.a>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
            {metricLabel}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {primaryMetric}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">
              {formatCount(dataset.downloadCount)}
            </span>{' '}
            downloads
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end">
          <Sparkline
            points={trend.points}
            positive={trend.direction !== 'down'}
          />
          <StatusBadge
            variant={
              trend.direction === 'up'
                ? 'positive'
                : trend.direction === 'down'
                  ? 'negative'
                  : 'neutral'
            }
          >
            {trend.direction === 'up' && '+'}
            {trend.direction === 'flat' ? 'Stable' : `${trend.changePercent}%`}
          </StatusBadge>
        </div>
      </div>

      <p className="mt-5 border-t border-gray-50 pt-4 text-sm leading-relaxed text-gray-500 sm:mt-6 sm:pt-5">
        {summary}
      </p>

      <footer className="mt-3 flex flex-wrap gap-2 sm:mt-4">
        <StatusBadge variant="neutral">
          {formatCount(dataset.voteCount)} votes
        </StatusBadge>
        <StatusBadge variant="positive">Active dataset</StatusBadge>
      </footer>
    </motion.article>
  )
}
