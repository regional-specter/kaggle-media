const CACHE_KEY = 'kaggle-scroller:metadata-cache'

export interface CachedMetadata {
  subtitle?: string
  description?: string
}

type MetadataCache = Record<string, CachedMetadata>

function readCache(): MetadataCache {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as MetadataCache) : {}
  } catch {
    return {}
  }
}

function writeCache(cache: MetadataCache): void {
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

export function getCachedMetadata(ref: string): CachedMetadata | null {
  const entry = readCache()[ref]
  if (!entry) return null
  if (!entry.subtitle?.trim() && !entry.description?.trim()) return null
  return entry
}

export function setCachedMetadata(ref: string, metadata: CachedMetadata): void {
  const cache = readCache()
  cache[ref] = metadata
  writeCache(cache)
}
