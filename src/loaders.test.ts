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

function mockFetchJson(data: unknown): typeof fetch {
  return vi.fn(async () => new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })) as unknown as typeof fetch
}

function expectFetchUrl(callIndex: number, url: string) {
  const call = vi.mocked(fetch).mock.calls[callIndex - 1]
  expect(call[0]).toEqual(new URL(url))
  expect(call[1]).toEqual({ signal: expect.any(AbortSignal) })
}

describe('loaders API requests', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetchJson(paginatedApiResponse))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('falls back to page 1 when the page query parameter is missing or invalid', async () => {
    await charactersLoader({ request: new Request('https://example.com/characters') })
    await locationsLoader({ request: new Request('https://example.com/locations?page=NaN') })
    await episodesLoader({ request: new Request('https://example.com/episodes?page=0') })

    expectFetchUrl(1, 'https://rickandmortyapi.com/api/character?page=1')
    expectFetchUrl(2, 'https://rickandmortyapi.com/api/location?page=1')
    expectFetchUrl(3, 'https://rickandmortyapi.com/api/episode?page=1')
  })

  it('uses the page query parameter when it is valid', async () => {
    await charactersLoader({ request: new Request('https://example.com/characters?page=2') })

    expectFetchUrl(1, 'https://rickandmortyapi.com/api/character?page=2')
  })

  it('loads detail pages without adding an empty URL segment', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: URL) => {
      const responses: Record<string, unknown> = {
        'https://rickandmortyapi.com/api/character/2': { id: 2, episode: [] },
        'https://rickandmortyapi.com/api/location/3': { id: 3, residents: [] },
        'https://rickandmortyapi.com/api/episode/4': { id: 4, characters: [] },
      }

      return new Response(JSON.stringify(responses[url.toString()]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }) as unknown as typeof fetch)

    await characterDetailLoader({ params: { characterId: '2' }, request: new Request('https://example.com/characters/2') })
    await locationDetailLoader({ params: { locationId: '3' }, request: new Request('https://example.com/locations/3') })
    await episodeDetailLoader({ params: { episodeId: '4' }, request: new Request('https://example.com/episodes/4') })

    expectFetchUrl(1, 'https://rickandmortyapi.com/api/character/2')
    expectFetchUrl(2, 'https://rickandmortyapi.com/api/location/3')
    expectFetchUrl(3, 'https://rickandmortyapi.com/api/episode/4')
  })
})
