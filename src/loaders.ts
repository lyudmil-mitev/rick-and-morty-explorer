import { Character, Episode, Location } from 'rickmortyapi'
import { Params } from 'react-router-dom'
import { fetchApiResource, fetchPaginatedResource, parseApiId } from './api'

function parsePage(request: Request) {
  const rawPage = new URL(request.url).searchParams.get('page')
  const page = Number.parseInt(rawPage ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

export async function charactersLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Character>('character', page)
  return { pages: response.info.pages, characters: response.results }
}

export async function characterDetailLoader({ params }: { params: Params<"characterId"> }) {
  return fetchApiResource<Character>('character', parseApiId(params.characterId, 'character'))
}

export async function locationsLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Location>('location', page)
  return { pages: response.info.pages, locations: response.results }
}

export async function locationDetailLoader({ params }: { params: Params<"locationId"> }) {
  return fetchApiResource<Location>('location', parseApiId(params.locationId, 'location'))
}

export async function episodesLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Episode>('episode', page)
  return { pages: response.info.pages, episodes: response.results }
}

export async function episodeDetailLoader({ params }: { params: Params<"episodeId"> }) {
  return fetchApiResource<Episode>('episode', parseApiId(params.episodeId, 'episode'))
}

export function parseAPIId(location: string) {
    try {
        const url = new URL(location);
        return parseInt(url.pathname.split('/').pop() || '', 10);
    } catch {
        return -1;
    }
}
