import { useCallback, useEffect, useRef, useState } from 'react'
import { listDatasets } from '../api/kaggle'
import type { KaggleCredentials, KaggleDataset } from '../types/kaggle'

interface UseDatasetsOptions {
  credentials: KaggleCredentials
  enabled: boolean
  search?: string
  sortBy?: string
}

export function useDatasets({
  credentials,
  enabled,
  search = '',
  sortBy = 'hottest',
}: UseDatasetsOptions) {
  const [datasets, setDatasets] = useState<KaggleDataset[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const fetchPage = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const id = ++requestId.current
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const results = await listDatasets(credentials, {
          page: pageToLoad,
          search,
          sortBy,
          pageSize: 20,
        })

        if (id !== requestId.current) return

        setDatasets((prev) => (append ? [...prev, ...results] : results))
        setHasMore(results.length >= 20)
        setPage(pageToLoad)
      } catch (err) {
        if (id !== requestId.current) return
        setError(err instanceof Error ? err.message : 'Failed to load datasets')
        if (!append) setDatasets([])
      } finally {
        if (id === requestId.current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [credentials, search, sortBy],
  )

  const refresh = useCallback(() => {
    setPage(1)
    setHasMore(true)
    void fetchPage(1, false)
  }, [fetchPage])

  const loadMore = useCallback(() => {
    if (!hasMore || loading || loadingMore) return
    void fetchPage(page + 1, true)
  }, [fetchPage, hasMore, loading, loadingMore, page])

  useEffect(() => {
    if (!enabled) {
      setDatasets([])
      setError(null)
      setLoading(false)
      return
    }
    void fetchPage(1, false)
  }, [enabled, fetchPage])

  return {
    datasets,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  }
}
