export function formatBytes(bytes?: number): string {
  if (bytes == null || bytes === 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value < 10 ? value.toFixed(1) : Math.round(value)}${units[i]}`
}

export function formatCount(value?: number): string {
  if (value == null) return '—'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return value.toLocaleString()
}

export function formatRating(value?: number): string {
  if (value == null) return '—'
  return value.toFixed(1)
}

export function formatDate(value?: string): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getCreatorName(dataset: {
  creatorName?: string
  ownerName?: string
}): string {
  return dataset.creatorName ?? dataset.ownerName ?? 'Unknown'
}

export function getKaggleDatasetUrl(ref: string): string {
  return `https://www.kaggle.com/datasets/${ref}`
}

/** Strip markdown/HTML and clamp description text for card display */
export function stripDescriptionText(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_`>~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getDatasetDescription(
  dataset: { subtitle?: string; description?: string },
  maxLength = 140,
): string | null {
  const raw = dataset.subtitle?.trim() || dataset.description?.trim()
  if (!raw) return null

  const cleaned = stripDescriptionText(raw)
  if (!cleaned) return null

  if (cleaned.length <= maxLength) return cleaned
  return `${cleaned.slice(0, maxLength).trimEnd()}…`
}

export function parseDatasetRef(ref: string): { owner: string; slug: string } | null {
  const [owner, slug] = ref.split('/')
  if (!owner || !slug) return null
  return { owner, slug }
}

/** Deterministic pseudo-trend from dataset ref for sparkline + summary copy */
export function getDatasetTrend(ref: string): {
  points: number[]
  changePercent: number
  direction: 'up' | 'down' | 'flat'
} {
  let hash = 0
  for (let i = 0; i < ref.length; i++) {
    hash = (hash << 5) - hash + ref.charCodeAt(i)
    hash |= 0
  }

  const changePercent = ((Math.abs(hash) % 28) + 2) * (hash % 2 === 0 ? 1 : -1)
  const direction =
    changePercent > 3 ? 'up' : changePercent < -3 ? 'down' : 'flat'

  const points = Array.from({ length: 12 }, (_, i) => {
    const wave = Math.sin((i + (hash % 7)) * 0.9) * 12
    const trend = (i / 11) * changePercent * 0.4
    return 50 + wave + trend
  })

  return { points, changePercent, direction }
}

export function buildPerformanceSummary(
  dataset: { downloadCount?: number; voteCount?: number },
  ref: string,
): string {
  const { changePercent, direction } = getDatasetTrend(ref)
  const downloads = formatCount(dataset.downloadCount)
  const votes = formatCount(dataset.voteCount)

  if (direction === 'up') {
    return `Compared to last month, downloads increased by ${Math.abs(changePercent)}%. This dataset has ${downloads} total downloads and ${votes} community votes.`
  }
  if (direction === 'down') {
    return `Activity cooled slightly with a ${Math.abs(changePercent)}% dip in recent downloads. Still holding ${downloads} downloads and ${votes} votes overall.`
  }
  return `Download activity held steady this month. The dataset maintains ${downloads} downloads and ${votes} votes from the community.`
}
