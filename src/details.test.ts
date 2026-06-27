import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchDetailsResource, isDisplayableDetails } from './details'
import type { DetailsRecord } from './details'

const originalFetch = globalThis.fetch

const detail: DetailsRecord = {
  id: 1,
  status: 'ok',
  textType: 'description',
  wikiTitle: 'Rick Sanchez',
  wikiUrl: 'https://rickandmorty.fandom.com/wiki/Rick_Sanchez',
  text: 'Rick source text',
  sources: [],
  notes: '',
}

describe('details dataset helpers', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('loads a single details record by resource and id', async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(detail),
    })
    globalThis.fetch = fetch

    await expect(fetchDetailsResource('characters', 1)).resolves.toEqual(detail)

    expect(fetch).toHaveBeenCalledWith('/data/rick-and-morty/details/characters/1.json', { signal: undefined })
  })

  it('returns null when a details record does not exist', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await expect(fetchDetailsResource('locations', 999)).resolves.toBeNull()
  })

  it('rejects failed non-404 detail requests', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    })

    await expect(fetchDetailsResource('episodes', 1)).rejects.toThrow('Failed to load details episodes/1')
  })

  it('only treats approved statuses with text as displayable', () => {
    expect(isDisplayableDetails(detail)).toBe(true)
    expect(isDisplayableDetails({ ...detail, status: 'contextual_source' })).toBe(true)
    expect(isDisplayableDetails({ ...detail, status: 'alias_match' })).toBe(true)
    expect(isDisplayableDetails({ ...detail, status: 'insufficient_source' })).toBe(false)
    expect(isDisplayableDetails({ ...detail, text: '   ' })).toBe(false)
    expect(isDisplayableDetails(null)).toBe(false)
  })
})
