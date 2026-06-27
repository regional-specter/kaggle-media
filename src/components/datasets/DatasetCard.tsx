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
  getDatasetTrend,
  getKaggleDatasetUrl,
} from '../../utils/format'
import { StatusBadge } from '../ui/StatusBadge'
import { Sparkline } from './Sparkline'

interface DatasetCardProps {
  dataset: KaggleDataset
  bookmarked: boolean
  onToggleBookmark: (ref: string, dataset: KaggleDataset) => void
}

export function DatasetCard({
  dataset,
  bookmarked,
  onToggleBookmark,
}: DatasetCardProps) {
  const creator = getCreatorName(dataset)
  const trend = getDatasetTrend(dataset.ref)
  const summary = buildPerformanceSummary(dataset, dataset.ref)
  const primaryMetric = formatRating(dataset.usabilityRating)
  const metricLabel = 'Usability Score'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition-shadow hover:shadow-md"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight text-gray-900">
            {dataset.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{creator}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>{formatBytes(dataset.totalBytes)}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>Updated {formatDate(dataset.lastUpdated)}</span>
          </p>
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
                : 'border-gray-100 bg-gray-50 text-gray-400 hover:text-gray-600'
            }`}
          >
            <Bookmark
              className="h-4 w-4"
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </motion.button>

          <a
            href={getKaggleDatasetUrl(dataset.ref)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in browser"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-400 transition-colors hover:text-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {metricLabel}
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
            {primaryMetric}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">
              {formatCount(dataset.downloadCount)}
            </span>{' '}
            downloads
          </p>
        </div>

        <div className="flex flex-col items-end">
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

      <p className="mt-6 border-t border-gray-50 pt-5 text-sm leading-relaxed text-gray-500">
        {summary}
      </p>

      <footer className="mt-4 flex flex-wrap gap-2">
        <StatusBadge variant="neutral">
          {formatCount(dataset.voteCount)} votes
        </StatusBadge>
        <StatusBadge variant="positive">Active dataset</StatusBadge>
      </footer>
    </motion.article>
  )
}
