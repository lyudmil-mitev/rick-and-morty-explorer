import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchApiResource, fetchApiResources, fetchPaginatedResource } from './api'

function mockFetchJson(data: unknown): typeof fetch {
  return vi.fn(async () => new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })) as unknown as typeof fetch
}

describe('Rick and Morty API helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('fetches a paginated resource without an empty path segment', async () => {
    vi.stubGlobal('fetch', mockFetchJson({ info: { pages: 1 }, results: [] }))

    await fetchPaginatedResource('character', 1)

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character?page=1'))
  })

  it('fetches a detail resource without an empty path segment', async () => {
    vi.stubGlobal('fetch', mockFetchJson({ id: 6 }))

    await fetchApiResource('character', 6)

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character/6'))
  })

  it('fetches multiple related resources without an empty path segment', async () => {
    vi.stubGlobal('fetch', mockFetchJson([{ id: 1 }, { id: 2 }, { id: 38 }]))

    await fetchApiResources('character', [1, 2, 38])

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character/1,2,38'))
  })
})
