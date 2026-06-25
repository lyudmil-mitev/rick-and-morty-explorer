import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchApiResource, fetchApiResources, fetchPaginatedResource, parseApiId } from './api'

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

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character?page=1'), { signal: undefined })
  })

  it('fetches a detail resource without an empty path segment', async () => {
    vi.stubGlobal('fetch', mockFetchJson({ id: 6 }))

    await fetchApiResource('character', 6)

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character/6'), { signal: undefined })
  })

  it('fetches multiple related resources without an empty path segment', async () => {
    vi.stubGlobal('fetch', mockFetchJson([{ id: 1 }, { id: 2 }, { id: 38 }]))

    await fetchApiResources('character', [1, 2, 38])

    expect(fetch).toHaveBeenCalledWith(new URL('https://rickandmortyapi.com/api/character/1,2,38'), { signal: undefined })
  })

  it('throws a not found response for invalid route ids', () => {
    try {
      parseApiId('nope', 'character')
      throw new Error('Expected parseApiId to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(Response)
      expect((error as Response).status).toBe(404)
      expect((error as Response).statusText).toBe('Not Found')
    }
  })

  it('preserves failed API response status codes', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Not found', {
      status: 404,
      statusText: 'Not Found',
    })) as unknown as typeof fetch)

    await expect(fetchApiResource('character', 999999)).rejects.toMatchObject({
      status: 404,
      statusText: 'Not Found',
    })
  })
})
