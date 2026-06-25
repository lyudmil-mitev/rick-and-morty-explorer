import { Character, Episode, Location } from 'rickmortyapi'
import { Params } from 'react-router-dom'
import { ApiResource, fetchApiResource, fetchApiResources, fetchPaginatedResource, parseApiId, parseApiUrlId } from './api'

type PaginatedLoaderData<TKey extends string, TResource> = {
  pages: number
} & Record<TKey, TResource[]>

export type CharacterDetailsLoaderData = {
  character: Character
  episodes: Episode[]
}

export type EpisodeDetailsLoaderData = {
  episode: Episode
  characters: Character[]
}

export type LocationDetailsLoaderData = {
  location: Location
  residents: Character[]
}

function parsePage(request: Request) {
  const rawPage = new URL(request.url).searchParams.get('page')
  const page = Number.parseInt(rawPage ?? '1', 10)

  return Number.isFinite(page) && page > 0 ? page : 1
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
): Promise<PaginatedLoaderData<TKey, TResource>> {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<TResource>(resource, page, request.signal)

  return {
    pages: response.info.pages,
    [resultKey]: response.results,
  } as PaginatedLoaderData<TKey, TResource>
}

export function charactersLoader({ request }: { request: Request }) {
  return loadPaginatedResource<'characters', Character>(request, 'character', 'characters')
}

export async function characterDetailLoader({ params, request }: { params: Params<"characterId">, request: Request }): Promise<CharacterDetailsLoaderData> {
  const character = await fetchApiResource<Character>('character', parseApiId(params.characterId, 'character'), request.signal)
  const episodes = await fetchApiResources<Episode>('episode', parseApiUrlIds(character.episode), request.signal)

  return { character, episodes }
}

export function locationsLoader({ request }: { request: Request }) {
  return loadPaginatedResource<'locations', Location>(request, 'location', 'locations')
}

export async function locationDetailLoader({ params, request }: { params: Params<"locationId">, request: Request }): Promise<LocationDetailsLoaderData> {
  const location = await fetchApiResource<Location>('location', parseApiId(params.locationId, 'location'), request.signal)
  const residents = await fetchApiResources<Character>('character', parseApiUrlIds(location.residents), request.signal)

  return { location, residents }
}

export function episodesLoader({ request }: { request: Request }) {
  return loadPaginatedResource<'episodes', Episode>(request, 'episode', 'episodes')
}

export async function episodeDetailLoader({ params, request }: { params: Params<"episodeId">, request: Request }): Promise<EpisodeDetailsLoaderData> {
  const episode = await fetchApiResource<Episode>('episode', parseApiId(params.episodeId, 'episode'), request.signal)
  const characters = await fetchApiResources<Character>('character', parseApiUrlIds(episode.characters), request.signal)

  return { episode, characters }
}
