import { beforeEach, describe, expect, it, vi } from 'vitest'
import { charactersLoader, episodesLoader, locationsLoader } from './loaders'
import { getCharacters, getEpisodes, getLocations } from 'rickmortyapi'

vi.mock('rickmortyapi', () => ({
  getCharacters: vi.fn(),
  getCharacter: vi.fn(),
  getLocations: vi.fn(),
  getLocation: vi.fn(),
  getEpisodes: vi.fn(),
  getEpisode: vi.fn(),
}))

const mockPaginatedResponse = {
  data: {
    info: { pages: 3 },
    results: [],
  },
}

describe('loaders pagination', () => {
  beforeEach(() => {
    vi.mocked(getCharacters).mockResolvedValue(mockPaginatedResponse)
    vi.mocked(getLocations).mockResolvedValue(mockPaginatedResponse)
    vi.mocked(getEpisodes).mockResolvedValue(mockPaginatedResponse)
  })

  it('falls back to page 1 when the page query parameter is missing or invalid', async () => {
    await charactersLoader({ request: new Request('https://example.com/characters') })
    await locationsLoader({ request: new Request('https://example.com/locations?page=NaN') })
    await episodesLoader({ request: new Request('https://example.com/episodes?page=0') })

    expect(getCharacters).toHaveBeenCalledWith({ page: 1 })
    expect(getLocations).toHaveBeenCalledWith({ page: 1 })
    expect(getEpisodes).toHaveBeenCalledWith({ page: 1 })
  })

  it('uses the page query parameter when it is valid', async () => {
    await charactersLoader({ request: new Request('https://example.com/characters?page=2') })

    expect(getCharacters).toHaveBeenCalledWith({ page: 2 })
  })
})
