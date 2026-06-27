import { Character, Episode, Location } from './rickmorty'
import { Params } from 'react-router-dom'
import { ApiResource, fetchApiResource, fetchApiResources, fetchPaginatedResource, parseApiId, parseApiUrlId } from './api'
import { DetailsRecord, DetailsResource, fetchDetailsResource } from './details'

type PaginatedLoaderData<TKey extends string, TResource> = {
  pages: number
} & Record<TKey, TResource[]>

export type CharacterDetailsLoaderData = {
  character: Character
  episodes: Episode[]
  details: DetailsRecord | null
}

export type EpisodeDetailsLoaderData = {
  episode: Episode
  characters: Character[]
  details: DetailsRecord | null
}

export type LocationDetailsLoaderData = {
  location: Location
  residents: Character[]
  details: DetailsRecord | null
}

function parsePage(request: Request) {
  const rawPage = new URL(request.url).searchParams.get('page')
  const page = Number.parseInt(rawPage ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
}

function pickFilters(request: Request, allowedFilters: string[]) {
  const requestParams = new URL(request.url).searchParams
  const filters = new URLSearchParams()

  for (const filter of allowedFilters) {
    const value = requestParams.get(filter)?.trim()
    if (value) {
      filters.set(filter, value)
    }
  }

  return filters
}

function parseApiUrlIds(urls: string[]) {
  return urls.flatMap((url) => {
    const id = parseApiUrlId(url)
    return id === null ? [] : [id]
  })
}

async function loadPaginatedResource<TKey extends string, TResource>(
  request: Request,
  resource: ApiResource,
  resultKey: TKey,
  allowedFilters: string[],
): Promise<PaginatedLoaderData<TKey, TResource>> {
  const page = parsePage(request)
  const filters = pickFilters(request, allowedFilters)
  const response = await fetchPaginatedResource<TResource>(resource, page, filters, request.signal)

  return {
    pages: response.info.pages,
    [resultKey]: response.results,
  } as PaginatedLoaderData<TKey, TResource>
}

export function charactersLoader({ request }: { request: Request }) {
  return loadPaginatedResource<'characters', Character>(request, 'character', 'characters', ['name', 'status', 'species', 'type', 'gender'])
}

export async function characterDetailLoader({ params, request }: { params: Params<"characterId">, request: Request }): Promise<CharacterDetailsLoaderData> {
  const characterId = parseApiId(params.characterId, 'character')
  const character = await fetchApiResource<Character>('character', characterId, request.signal)
  const [episodes, details] = await Promise.all([
    fetchApiResources<Episode>('episode', parseApiUrlIds(character.episode), request.signal),
    loadDetails('characters', characterId, request.signal),
  ])

  return { character, episodes, details }
}

export function locationsLoader({ request }: { request: Request }) {
  return loadPaginatedResource<'locations', Location>(request, 'location', 'locations', ['name', 'type', 'dimension'])
}

export async function locationDetailLoader({ params, request }: { params: Params<"locationId">, request: Request }): Promise<LocationDetailsLoaderData> {
  const locationId = parseApiId(params.locationId, 'location')
  const location = await fetchApiResource<Location>('location', locationId, request.signal)
  const [residents, details] = await Promise.all([
    fetchApiResources<Character>('character', parseApiUrlIds(location.residents), request.signal),
    loadDetails('locations', locationId, request.signal),
  ])

  return { location, residents, details }
}

export function episodesLoader({ request }: { request: Request }) {
  return loadPaginatedResource<'episodes', Episode>(request, 'episode', 'episodes', ['name', 'episode'])
}

export async function episodeDetailLoader({ params, request }: { params: Params<"episodeId">, request: Request }): Promise<EpisodeDetailsLoaderData> {
  const episodeId = parseApiId(params.episodeId, 'episode')
  const episode = await fetchApiResource<Episode>('episode', episodeId, request.signal)
  const [characters, details] = await Promise.all([
    fetchApiResources<Character>('character', parseApiUrlIds(episode.characters), request.signal),
    loadDetails('episodes', episodeId, request.signal),
  ])

  return { episode, characters, details }
}

async function loadDetails(resource: DetailsResource, id: number, signal?: AbortSignal) {
  try {
    return await fetchDetailsResource(resource, id, signal)
  } catch {
    return null
  }
}
