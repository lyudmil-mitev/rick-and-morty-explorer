import { getCharacters, getCharacter, getLocations, getLocation, getEpisodes, getEpisode } from 'rickmortyapi'
import { Params } from 'react-router-dom'

export async function charactersLoader({ request }: { request: Request }) {
  const page = parseInt(new URL(request.url).searchParams.get('page') ?? "", 10) ?? 1;
  const response = await getCharacters({ page })
  if (typeof response.data === "undefined" || typeof response.data.info === "undefined") {
    throw new Error(`Failed to load characters`)
  } else {
    return { pages: response.data.info.pages, characters: response.data.results }
  }
}

export async function characterDetailLoader({ params }: { params: Params<"characterId"> }) {
  const response = await getCharacter(parseInt(params.characterId ?? "", 10))
  return response.data
}

export async function locationsLoader({ request }: { request: Request }) {
  const page = parseInt(new URL(request.url).searchParams.get('page') ?? "", 10) ?? 1;
  const response = await getLocations({ page })
  if (typeof response.data === "undefined" || typeof response.data.info === "undefined") {
    throw new Error(`Failed to load locations`)
  } else {
    return { pages: response.data.info.pages, locations: response.data.results }
  }
}

export async function locationDetailLoader({ params }: { params: Params<"locationId"> }) {
  const response = await getLocation(parseInt(params.locationId ?? "", 10))
  return response.data
}

export async function episodesLoader({ request }: { request: Request }) {
  const page = parseInt(new URL(request.url).searchParams.get('page') ?? "", 10) ?? 1;
  const response = await getEpisodes({ page })
  if (typeof response.data === "undefined" || typeof response.data.info === "undefined") {
    throw new Error(`Failed to load episodes`)
  } else {
    return { pages: response.data.info.pages, episodes: response.data.results }
  }
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