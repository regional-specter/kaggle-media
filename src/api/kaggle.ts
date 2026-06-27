import type {
  DatasetListParams,
  KaggleCredentials,
  KaggleDataset,
} from '../types/kaggle'

const KAGGLE_API_BASE = 'https://www.kaggle.com/api/v1'

function buildAuthHeader(credentials: KaggleCredentials): string {
  const token = btoa(`${credentials.username}:${credentials.apiKey}`)
  return `Basic ${token}`
}

async function kaggleFetch<T>(
  path: string,
  credentials: KaggleCredentials,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${KAGGLE_API_BASE}${path}`)

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

export async function listDatasets(
  credentials: KaggleCredentials,
  params: DatasetListParams = {},
): Promise<KaggleDataset[]> {
  const { sortBy = 'hottest', page = 1, search = '', pageSize = 20 } = params

  return kaggleFetch<KaggleDataset[]>('/datasets/list', credentials, {
    sort_by: sortBy,
    page,
    search,
    page_size: pageSize,
  })
}

export async function validateCredentials(
  credentials: KaggleCredentials,
): Promise<boolean> {
  await listDatasets(credentials, { page: 1, pageSize: 1 })
  return true
}
