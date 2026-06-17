import { Character, Episode, getCharacter, getEpisode, getLocation, Location, Params as APIParams } from 'rickmortyapi'
import { Params } from 'react-router-dom'

type PaginatedResponse<T> = {
  info: {
    pages: number
  }
  results: T[]
}

const API_BASE_URL = 'https://rickandmortyapi.com/api'

function parsePage(request: Request) {
  const rawPage = new URL(request.url).searchParams.get('page')
  const page = Number.parseInt(rawPage ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

async function fetchPaginatedResource<T>(resource: 'character' | 'location' | 'episode', page: number) {
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
  const response = await getCharacter(parseInt(params.characterId ?? "", 10))
  return response.data
}

export async function locationsLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Location>('location', page)
  return { pages: response.info.pages, locations: response.results }
}

export async function locationDetailLoader({ params }: { params: Params<"locationId"> }) {
  const response = await getLocation(parseInt(params.locationId ?? "", 10))
  return response.data
}

export async function episodesLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Episode>('episode', page)
  return { pages: response.info.pages, episodes: response.results }
}

export async function episodeDetailLoader({ params }: { params: Params<"episodeId"> }) {
  const response = await getEpisode(parseInt(params.episodeId ?? "", 10))
  return response.data
}

export function parseAPIId(location: string) {
    try {
        const url = new URL(location);
        return parseInt(url.pathname.split('/').pop() || '', 10);
    } catch (error) {
        return -1;
    }
}
