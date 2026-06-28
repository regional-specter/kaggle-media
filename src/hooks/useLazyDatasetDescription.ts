import { useEffect, useRef, useState } from 'react'
import { getDatasetMetadata } from '../api/kaggle'
import type { KaggleCredentials, KaggleDataset } from '../types/kaggle'
import { getCachedMetadata, setCachedMetadata } from '../utils/metadataCache'

interface UseLazyDatasetDescriptionOptions {
  credentials?: KaggleCredentials
  dataset: KaggleDataset
  enabled?: boolean
}

export function useLazyDatasetDescription({
  credentials,
  dataset,
  enabled = true,
}: UseLazyDatasetDescriptionOptions) {
  const cardRef = useRef<HTMLElement>(null)
  const [enriched, setEnriched] = useState<KaggleDataset>(dataset)
  const fetchedRef = useRef(false)

  useEffect(() => {
    setEnriched(dataset)
    fetchedRef.current = false
  }, [dataset.ref, dataset.subtitle, dataset.description])

  useEffect(() => {
    if (!enabled || !credentials) return
    if (dataset.subtitle?.trim() || dataset.description?.trim()) return

    const cached = getCachedMetadata(dataset.ref)
    if (cached) {
      setEnriched((prev) => ({ ...prev, ...cached }))
      fetchedRef.current = true
      return
    }

    const node = cardRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || fetchedRef.current) return
        fetchedRef.current = true

        void getDatasetMetadata(credentials, dataset.ref)
          .then((meta) => {
            if (!meta.subtitle?.trim() && !meta.description?.trim()) return
            setCachedMetadata(dataset.ref, meta)
            setEnriched((prev) => ({ ...prev, ...meta }))
          })
          .catch(() => {
            fetchedRef.current = false
          })
      },
      { rootMargin: '100px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [credentials, dataset.ref, dataset.subtitle, dataset.description, enabled])

  return { cardRef, dataset: enriched }
}
