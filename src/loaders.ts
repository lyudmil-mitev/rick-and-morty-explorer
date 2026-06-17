import { Character, Episode, Location } from 'rickmortyapi'
import { Params } from 'react-router-dom'
import { fetchApiResource, fetchApiResources, fetchPaginatedResource, parseApiId, parseApiUrlId } from './api'

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

export async function charactersLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Character>('character', page, request.signal)
  return { pages: response.info.pages, characters: response.results }
}

export async function characterDetailLoader({ params, request }: { params: Params<"characterId">, request: Request }): Promise<CharacterDetailsLoaderData> {
  const character = await fetchApiResource<Character>('character', parseApiId(params.characterId, 'character'), request.signal)
  const episodes = await fetchApiResources<Episode>('episode', parseApiUrlIds(character.episode), request.signal)

  return { character, episodes }
}

export async function locationsLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Location>('location', page, request.signal)
  return { pages: response.info.pages, locations: response.results }
}

export async function locationDetailLoader({ params, request }: { params: Params<"locationId">, request: Request }): Promise<LocationDetailsLoaderData> {
  const location = await fetchApiResource<Location>('location', parseApiId(params.locationId, 'location'), request.signal)
  const residents = await fetchApiResources<Character>('character', parseApiUrlIds(location.residents), request.signal)

  return { location, residents }
}

export async function episodesLoader({ request }: { request: Request }) {
  const page = parsePage(request)
  const response = await fetchPaginatedResource<Episode>('episode', page, request.signal)
  return { pages: response.info.pages, episodes: response.results }
}

export async function episodeDetailLoader({ params, request }: { params: Params<"episodeId">, request: Request }): Promise<EpisodeDetailsLoaderData> {
  const episode = await fetchApiResource<Episode>('episode', parseApiId(params.episodeId, 'episode'), request.signal)
  const characters = await fetchApiResources<Character>('character', parseApiUrlIds(episode.characters), request.signal)

  return { episode, characters }
}
