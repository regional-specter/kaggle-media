import type {
  DatasetListParams,
  KaggleCredentials,
  KaggleDataset,
} from '../types/kaggle'
import { parseDatasetRef } from '../utils/format'

const KAGGLE_API_BASE =
  import.meta.env.VITE_KAGGLE_API_BASE ?? '/api/kaggle'

type RawDataset = Record<string, unknown>

function buildAuthHeader(credentials: KaggleCredentials): string {
  const token = btoa(`${credentials.username}:${credentials.apiKey}`)
  return `Basic ${token}`
}

async function kaggleFetch<T>(
  path: string,
  credentials: KaggleCredentials,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const isProxy = !KAGGLE_API_BASE.startsWith('http')
  const url = isProxy
    ? new URL(`${KAGGLE_API_BASE}${path}`, window.location.origin)
    : new URL(`${KAGGLE_API_BASE}${path}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: buildAuthHeader(credentials),
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(
      message || `Kaggle API error (${response.status} ${response.statusText})`,
    )
  }

  return response.json() as Promise<T>
}

function pickString(raw: RawDataset, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = raw[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return undefined
}

function pickNumber(raw: RawDataset, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = raw[key]
    if (typeof value === 'number' && !Number.isNaN(value)) return value
  }
  return undefined
}

export function normalizeDataset(raw: RawDataset): KaggleDataset {
  return {
    ref: pickString(raw, 'ref') ?? '',
    title: pickString(raw, 'title') ?? 'Untitled dataset',
    creatorName: pickString(raw, 'creatorName', 'creator_name'),
    ownerName: pickString(raw, 'ownerName', 'owner_name'),
    totalBytes: pickNumber(raw, 'totalBytes', 'total_bytes'),
    usabilityRating: pickNumber(raw, 'usabilityRating', 'usability_rating'),
    voteCount: pickNumber(raw, 'voteCount', 'vote_count'),
    downloadCount: pickNumber(raw, 'downloadCount', 'download_count'),
    lastUpdated: pickString(raw, 'lastUpdated', 'last_updated'),
    subtitle: pickString(raw, 'subtitle'),
    description: pickString(raw, 'description'),
  }
}

export async function listDatasets(
  credentials: KaggleCredentials,
  params: DatasetListParams = {},
): Promise<KaggleDataset[]> {
  const { sortBy = 'hottest', page = 1, search = '', pageSize = 20 } = params

  const results = await kaggleFetch<RawDataset[]>('/datasets/list', credentials, {
    sort_by: sortBy,
    page,
    search,
    page_size: pageSize,
  })

  return results.map(normalizeDataset)
}

interface DatasetMetadataResponse {
  info?: {
    subtitle?: string
    description?: string
  }
  subtitle?: string
  description?: string
}

export async function getDatasetMetadata(
  credentials: KaggleCredentials,
  ref: string,
): Promise<Pick<KaggleDataset, 'subtitle' | 'description'>> {
  const parsed = parseDatasetRef(ref)
  if (!parsed) return {}

  const response = await kaggleFetch<DatasetMetadataResponse>(
    `/datasets/metadata/${parsed.owner}/${parsed.slug}`,
    credentials,
  )

  return {
    subtitle: response.info?.subtitle ?? response.subtitle,
    description: response.info?.description ?? response.description,
  }
}

export async function enrichDatasetsWithDescriptions(
  credentials: KaggleCredentials,
  datasets: KaggleDataset[],
  concurrency = 4,
): Promise<KaggleDataset[]> {
  const needsEnrichment = datasets.filter(
    (d) => !d.subtitle?.trim() && !d.description?.trim(),
  )

  if (needsEnrichment.length === 0) return datasets

  const enriched = new Map<string, Pick<KaggleDataset, 'subtitle' | 'description'>>()

  for (let i = 0; i < needsEnrichment.length; i += concurrency) {
    const batch = needsEnrichment.slice(i, i + concurrency)
    const results = await Promise.allSettled(
      batch.map(async (dataset) => {
        const meta = await getDatasetMetadata(credentials, dataset.ref)
        return { ref: dataset.ref, meta }
      }),
    )

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        enriched.set(result.value.ref, result.value.meta)
      }
    })
  }

  return datasets.map((dataset) => {
    const meta = enriched.get(dataset.ref)
    if (!meta) return dataset
    return { ...dataset, ...meta }
  })
}

export async function validateCredentials(
  credentials: KaggleCredentials,
): Promise<boolean> {
  await listDatasets(credentials, { page: 1, pageSize: 1 })
  return true
}
