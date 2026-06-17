import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  characterDetailLoader,
  charactersLoader,
  episodeDetailLoader,
  episodesLoader,
  locationDetailLoader,
  locationsLoader,
} from './loaders'

const paginatedApiResponse = {
  info: {
    count: 0,
    pages: 3,
    next: null,
    prev: null,
  },
  results: [],
}

function mockFetchJson(data: unknown) {
  return vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>().mockResolvedValue(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

describe('loaders API requests', () => {
  beforeEach(() => {
    globalThis.fetch = mockFetchJson(paginatedApiResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('falls back to page 1 when the page query parameter is missing or invalid', async () => {
    await charactersLoader({ request: new Request('https://example.com/characters') })
    await locationsLoader({ request: new Request('https://example.com/locations?page=NaN') })
    await episodesLoader({ request: new Request('https://example.com/episodes?page=0') })

    expect(fetch).toHaveBeenNthCalledWith(1, new URL('https://rickandmortyapi.com/api/character?page=1'))
    expect(fetch).toHaveBeenNthCalledWith(2, new URL('https://rickandmortyapi.com/api/location?page=1'))
    expect(fetch).toHaveBeenNthCalledWith(3, new URL('https://rickandmortyapi.com/api/episode?page=1'))
  })

  it('uses the page query parameter when it is valid', async () => {
    await charactersLoader({ request: new Request('https://example.com/characters?page=2') })

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character?page=2'))
  })

  it('loads detail pages without adding an empty URL segment', async () => {
    await characterDetailLoader({ params: { characterId: '2' } })
    await locationDetailLoader({ params: { locationId: '3' } })
    await episodeDetailLoader({ params: { episodeId: '4' } })

    expect(fetch).toHaveBeenNthCalledWith(1, new URL('https://rickandmortyapi.com/api/character/2'))
    expect(fetch).toHaveBeenNthCalledWith(2, new URL('https://rickandmortyapi.com/api/location/3'))
    expect(fetch).toHaveBeenNthCalledWith(3, new URL('https://rickandmortyapi.com/api/episode/4'))
  })
})
