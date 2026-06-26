import type { Character, Episode, Location } from './rickmorty'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  characterDetailLoader,
  charactersLoader,
  episodeDetailLoader,
  episodesLoader,
  locationDetailLoader,
  locationsLoader,
} from './loaders'

const apiMocks = vi.hoisted(() => ({
  fetchApiResource: vi.fn(),
  fetchApiResources: vi.fn(),
  fetchPaginatedResource: vi.fn(),
}))

vi.mock('./api', async (importActual) => {
  const actual = await importActual<typeof import('./api')>()

  return {
    ...actual,
    fetchApiResource: apiMocks.fetchApiResource,
    fetchApiResources: apiMocks.fetchApiResources,
    fetchPaginatedResource: apiMocks.fetchPaginatedResource,
  }
})

const emptyPage = {
  info: {
    count: 0,
    pages: 3,
    next: null,
    prev: null,
  },
  results: [],
}

describe('loaders API requests', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('falls back to page 1 when the page query parameter is missing or invalid', async () => {
    apiMocks.fetchPaginatedResource.mockResolvedValue(emptyPage)

    await charactersLoader({ request: new Request('https://example.com/characters') })
    await locationsLoader({ request: new Request('https://example.com/locations?page=NaN') })
    await episodesLoader({ request: new Request('https://example.com/episodes?page=0') })

    expect(apiMocks.fetchPaginatedResource).toHaveBeenNthCalledWith(1, 'character', 1, new URLSearchParams(), expect.any(AbortSignal))
    expect(apiMocks.fetchPaginatedResource).toHaveBeenNthCalledWith(2, 'location', 1, new URLSearchParams(), expect.any(AbortSignal))
    expect(apiMocks.fetchPaginatedResource).toHaveBeenNthCalledWith(3, 'episode', 1, new URLSearchParams(), expect.any(AbortSignal))
  })

  it('uses the page query parameter when it is valid', async () => {
    apiMocks.fetchPaginatedResource.mockResolvedValue(emptyPage)

    await charactersLoader({ request: new Request('https://example.com/characters?page=2') })

    expect(apiMocks.fetchPaginatedResource).toHaveBeenCalledWith('character', 2, new URLSearchParams(), expect.any(AbortSignal))
  })

  it('forwards supported listing filters and ignores unsupported query params', async () => {
    apiMocks.fetchPaginatedResource.mockResolvedValue(emptyPage)

    await charactersLoader({ request: new Request('https://example.com/characters?page=3&status=dead&species=Human&dimension=C-137') })
    await locationsLoader({ request: new Request('https://example.com/locations?dimension=C-137&type=Planet&status=alive') })
    await episodesLoader({ request: new Request('https://example.com/episodes?episode=S02&gender=male') })

    expect(apiMocks.fetchPaginatedResource).toHaveBeenNthCalledWith(1, 'character', 3, new URLSearchParams([
      ['status', 'dead'],
      ['species', 'Human'],
    ]), expect.any(AbortSignal))
    expect(apiMocks.fetchPaginatedResource).toHaveBeenNthCalledWith(2, 'location', 1, new URLSearchParams([
      ['type', 'Planet'],
      ['dimension', 'C-137'],
    ]), expect.any(AbortSignal))
    expect(apiMocks.fetchPaginatedResource).toHaveBeenNthCalledWith(3, 'episode', 1, new URLSearchParams([
      ['episode', 'S02'],
    ]), expect.any(AbortSignal))
  })

  it('loads detail resources and their relationships', async () => {
    const character = { id: 2, episode: ['https://rickandmortyapi.com/api/episode/1', 'bad-url'] } as Character
    const location = { id: 3, residents: ['https://rickandmortyapi.com/api/character/1'] } as Location
    const episode = { id: 4, characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'] } as Episode

    apiMocks.fetchApiResource
      .mockResolvedValueOnce(character)
      .mockResolvedValueOnce(location)
      .mockResolvedValueOnce(episode)
    apiMocks.fetchApiResources.mockResolvedValue([])

    await characterDetailLoader({ params: { characterId: '2' }, request: new Request('https://example.com/characters/2') })
    await locationDetailLoader({ params: { locationId: '3' }, request: new Request('https://example.com/locations/3') })
    await episodeDetailLoader({ params: { episodeId: '4' }, request: new Request('https://example.com/episodes/4') })

    expect(apiMocks.fetchApiResource).toHaveBeenNthCalledWith(1, 'character', 2, expect.any(AbortSignal))
    expect(apiMocks.fetchApiResources).toHaveBeenNthCalledWith(1, 'episode', [1], expect.any(AbortSignal))
    expect(apiMocks.fetchApiResource).toHaveBeenNthCalledWith(2, 'location', 3, expect.any(AbortSignal))
    expect(apiMocks.fetchApiResources).toHaveBeenNthCalledWith(2, 'character', [1], expect.any(AbortSignal))
    expect(apiMocks.fetchApiResource).toHaveBeenNthCalledWith(3, 'episode', 4, expect.any(AbortSignal))
    expect(apiMocks.fetchApiResources).toHaveBeenNthCalledWith(3, 'character', [1, 2], expect.any(AbortSignal))
  })
})
