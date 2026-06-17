export type ApiResource = 'character' | 'location' | 'episode'

export type PaginatedResponse<T> = {
  info: {
    pages: number
  }
  results: T[]
}

const API_BASE_URL = 'https://rickandmortyapi.com/api'

export function parseApiId(id: string | undefined, resource: ApiResource) {
  const parsedId = Number.parseInt(id ?? '', 10)

  if (!Number.isFinite(parsedId) || parsedId < 1) {
    throw new Error(`Invalid ${resource} id`)
  }

  return parsedId
}

export async function fetchApiResource<T>(resource: ApiResource, id: number) {
  const url = new URL(`${API_BASE_URL}/${resource}/${id}`)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}`)
  }

  return response.json() as Promise<T>
}

export async function fetchApiResources<T>(resource: ApiResource, ids: number[]) {
  const validIds = ids.filter((id) => Number.isFinite(id) && id > 0)

  if (validIds.length === 0) {
    return []
  }

  const url = new URL(`${API_BASE_URL}/${resource}/${validIds.join(',')}`)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}s`)
  }

  const data = await response.json() as T | T[]
  return Array.isArray(data) ? data : [data]
}

export async function fetchPaginatedResource<T>(resource: ApiResource, page: number) {
  const url = new URL(`${API_BASE_URL}/${resource}`)
  url.searchParams.set('page', String(page))

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}s`)
  }

  return response.json() as Promise<PaginatedResponse<T>>
}
