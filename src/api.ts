import { getPaginatedResource, getResource, getResources } from './dataset'

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
  const record = await getResource<T>(resource, id, signal)

  if (!record) {
    throw routeError(`Failed to load ${resource}`, 404, 'Not Found')
  }

  return record
}

export async function fetchApiResources<T>(resource: ApiResource, ids: number[], signal?: AbortSignal) {
  const validIds = ids.filter((id) => Number.isFinite(id) && id > 0)

  if (validIds.length === 0) {
    return []
  }

  return getResources<T>(resource, validIds, signal)
}

export async function fetchPaginatedResource<T>(resource: ApiResource, page: number, filters = new URLSearchParams(), signal?: AbortSignal) {
  return getPaginatedResource<T>(resource, page, filters, signal)
}
