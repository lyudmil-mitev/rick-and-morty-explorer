export type ApiResource = 'character' | 'location' | 'episode'

export type PaginatedResponse<T> = {
  info: {
    count?: number
    pages: number
    next?: string | null
    prev?: string | null
  }
  results: T[]
}

const API_BASE_URL = 'https://rickandmortyapi.com/api'

function routeError(message: string, status = 500, statusText = message) {
  return new Response(message, { status, statusText })
}

export function parseApiId(id: string | undefined, resource: ApiResource) {
  const parsedId = Number.parseInt(id ?? '', 10)

  if (!Number.isFinite(parsedId) || parsedId < 1) {
    throw routeError(`Invalid ${resource} id`, 404, 'Not Found')
  }

  return parsedId
}

export function parseApiUrlId(location: string) {
  try {
    const url = new URL(location)
    const id = Number.parseInt(url.pathname.split('/').pop() ?? '', 10)
    return Number.isFinite(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

export async function fetchApiResource<T>(resource: ApiResource, id: number, signal?: AbortSignal) {
  const url = new URL(`${API_BASE_URL}/${resource}/${id}`)
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw routeError(`Failed to load ${resource}`, response.status, response.statusText)
  }

  return response.json() as Promise<T>
}

export async function fetchApiResources<T>(resource: ApiResource, ids: number[], signal?: AbortSignal) {
  const validIds = ids.filter((id) => Number.isFinite(id) && id > 0)

  if (validIds.length === 0) {
    return []
  }

  const url = new URL(`${API_BASE_URL}/${resource}/${validIds.join(',')}`)
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw routeError(`Failed to load ${resource}s`, response.status, response.statusText)
  }

  const data = await response.json() as T | T[]
  return Array.isArray(data) ? data : [data]
}

export async function fetchPaginatedResource<T>(resource: ApiResource, page: number, filters = new URLSearchParams(), signal?: AbortSignal) {
  const url = new URL(`${API_BASE_URL}/${resource}`)
  url.searchParams.set('page', String(page))
  filters.forEach((value, key) => {
    if (key !== 'page' && value.trim().length > 0) {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url, { signal })

  if (response.status === 404 && Array.from(filters.values()).some((value) => value.trim().length > 0)) {
    return {
      info: {
        count: 0,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [],
    } satisfies PaginatedResponse<T>
  }

  if (!response.ok) {
    throw routeError(`Failed to load ${resource}s`, response.status, response.statusText)
  }

  return response.json() as Promise<PaginatedResponse<T>>
}
