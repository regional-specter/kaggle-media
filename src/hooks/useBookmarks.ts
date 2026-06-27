import { useCallback } from 'react'
import type { KaggleDataset } from '../types/kaggle'
import { useLocalStorage } from './useLocalStorage'

const BOOKMARKS_KEY = 'kaggle-scroller:bookmarks'
const BOOKMARK_CACHE_KEY = 'kaggle-scroller:bookmark-cache'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>(BOOKMARKS_KEY, [])
  const [cache, setCache] = useLocalStorage<Record<string, KaggleDataset>>(
    BOOKMARK_CACHE_KEY,
    {},
  )

  const isBookmarked = useCallback(
    (ref: string) => bookmarks.includes(ref),
    [bookmarks],
  )

  const toggleBookmark = useCallback(
    (ref: string, dataset?: KaggleDataset) => {
      setBookmarks((prev) => {
        const next = prev.includes(ref)
          ? prev.filter((id) => id !== ref)
          : [...prev, ref]

        setCache((prevCache) => {
          const nextCache = { ...prevCache }
          if (next.includes(ref) && dataset) {
            nextCache[ref] = dataset
          } else {
            delete nextCache[ref]
          }
          return nextCache
        })

        return next
      })
    },
    [setBookmarks, setCache],
  )

  const bookmarkedDatasets = bookmarks
    .map((ref) => cache[ref])
    .filter((dataset): dataset is KaggleDataset => Boolean(dataset))

  return {
    bookmarks,
    bookmarkedDatasets,
    isBookmarked,
    toggleBookmark,
  }
}
