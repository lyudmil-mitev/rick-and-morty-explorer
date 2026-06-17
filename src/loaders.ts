import { Character, Episode, Location } from 'rickmortyapi'
import { Params } from 'react-router-dom'

type PaginatedResponse<T> = {
  info: {
    pages: number
  }
  results: T[]
}

const API_BASE_URL = 'https://rickandmortyapi.com/api'
type ApiResource = 'character' | 'location' | 'episode'

function parsePage(request: Request) {
  const rawPage = new URL(request.url).searchParams.get('page')
  const page = Number.parseInt(rawPage ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

function parseId(id: string | undefined, resource: ApiResource) {
  const parsedId = Number.parseInt(id ?? '', 10)

  if (!Number.isFinite(parsedId) || parsedId < 1) {
    throw new Error(`Invalid ${resource} id`)
  }

  return parsedId
}

async function fetchApiResource<T>(resource: ApiResource, id?: number) {
  const url = new URL(`${API_BASE_URL}/${resource}${typeof id === 'number' ? `/${id}` : ''}`)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}`)
  }

  return response.json() as Promise<T>
}

async function fetchPaginatedResource<T>(resource: ApiResource, page: number) {
  const url = new URL(`${API_BASE_URL}/${resource}`)
  url.searchParams.set('page', String(page))

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}s`)
  }

  return response.json() as Promise<PaginatedResponse<T>>
}

export async function charactersLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Character>('character', page)
  return { pages: response.info.pages, characters: response.results }
}

export async function characterDetailLoader({ params }: { params: Params<"characterId"> }) {
  return fetchApiResource<Character>('character', parseId(params.characterId, 'character'))
}

export async function locationsLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Location>('location', page)
  return { pages: response.info.pages, locations: response.results }
}

export async function locationDetailLoader({ params }: { params: Params<"locationId"> }) {
  return fetchApiResource<Location>('location', parseId(params.locationId, 'location'))
}

export async function episodesLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Episode>('episode', page)
  return { pages: response.info.pages, episodes: response.results }
}

export async function episodeDetailLoader({ params }: { params: Params<"episodeId"> }) {
  return fetchApiResource<Episode>('episode', parseId(params.episodeId, 'episode'))
}

export function parseAPIId(location: string) {
    try {
        const url = new URL(location);
        return parseInt(url.pathname.split('/').pop() || '', 10);
    } catch (error) {
        return -1;
    }
}
