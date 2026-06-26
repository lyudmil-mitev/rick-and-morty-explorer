import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchApiResource, fetchApiResources, fetchPaginatedResource, parseApiId } from './api'
import { parseCsv, parsePipeIds, resetDatasetForTests, rewriteCharacterImagePath } from './dataset'

const fixtureFiles = {
  'manifest.json': JSON.stringify({
    dataset: 'robbroadhead/rick-and-morty-api-dataset',
    generatedAt: '2026-06-26T00:00:00.000Z',
    cacheVersion: 'fixture-v1',
    files: [
      'characters.csv',
      'locations.csv',
      'episodes.csv',
    ],
  }),
  'characters.csv': [
    'id,name,status,species,type,gender,origin_id,origin_name,location_id,location_name,image_file,episode_ids,url,created',
    '1,"Rick, Prime",Alive,Human,,Male,1,Earth,2,Citadel,images/characters/001-rick-prime.jpeg,1|2,https://rickandmortyapi.com/api/character/1,2017-11-04T18:48:46.250Z',
    '2,Morty Smith,Alive,Human,,Male,1,Earth,1,Earth,images/characters/002-morty-smith.jpeg,1,https://rickandmortyapi.com/api/character/2,2017-11-04T18:50:21.651Z',
    '3,Birdperson,Dead,Alien,Bird-Person,Male,,unknown,3,Planet Squanch,https://rickandmortyapi.com/api/character/avatar/3.jpeg,2,https://rickandmortyapi.com/api/character/3,2017-11-04T19:50:21.651Z',
  ].join('\n'),
  'locations.csv': [
    'id,name,type,dimension,resident_ids,url,created',
    '1,Earth,Planet,Dimension C-137,1|2,https://rickandmortyapi.com/api/location/1,2017-11-10T12:42:04.162Z',
    '2,Citadel,Space station,unknown,1,https://rickandmortyapi.com/api/location/2,2017-11-10T13:08:13.191Z',
    '3,Planet Squanch,Planet,Replacement Dimension,3,https://rickandmortyapi.com/api/location/3,2017-11-10T13:09:13.191Z',
  ].join('\n'),
  'episodes.csv': [
    'id,name,air_date,episode,character_ids,url,created',
    '1,Pilot,"December 2, 2013",S01E01,1|2,https://rickandmortyapi.com/api/episode/1,2017-11-10T12:56:33.798Z',
    '2,Ricksy Business,"April 14, 2014",S01E11,1|3,https://rickandmortyapi.com/api/episode/2,2017-11-10T12:56:34.747Z',
  ].join('\n'),
}

function stubDatasetFetch(files: Record<string, string> = fixtureFiles) {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString()
    const fileName = Object.keys(files).find((name) => url.endsWith(name))

    if (!fileName) {
      return new Response('Not Found', { status: 404, statusText: 'Not Found' })
    }

    const contentType = fileName.endsWith('.json') ? 'application/json' : 'text/csv'
    return new Response(files[fileName], {
      status: 200,
      headers: { 'Content-Type': contentType },
    })
  }) as unknown as typeof fetch)
}

describe('dataset-backed API helpers', () => {
  afterEach(() => {
    resetDatasetForTests()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('loads and paginates resources from static CSV files', async () => {
    stubDatasetFetch()

    const response = await fetchPaginatedResource('character', 1)

    expect(response.info).toEqual({
      count: 3,
      pages: 1,
      next: null,
      prev: null,
    })
    expect(response.results).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        name: 'Rick, Prime',
        image: '/data/rick-and-morty/images/characters/001-rick-prime.jpeg',
        episode: [
          'https://rickandmortyapi.com/api/episode/1',
          'https://rickandmortyapi.com/api/episode/2',
        ],
      }),
      expect.objectContaining({
        id: 2,
        location: {
          name: 'Earth',
          url: 'https://rickandmortyapi.com/api/location/1',
        },
      }),
    ]))
  })

  it('filters with supported API-style query parameters', async () => {
    stubDatasetFetch()

    await expect(fetchPaginatedResource('character', 1, new URLSearchParams([
      ['status', 'Alive'],
      ['species', 'human'],
      ['name', 'morty'],
    ]))).resolves.toMatchObject({
      info: { count: 1, pages: 1 },
      results: [{ id: 2, name: 'Morty Smith' }],
    })

    await expect(fetchPaginatedResource('episode', 1, new URLSearchParams([['episode', 'S99']]))).resolves.toEqual({
      info: {
        count: 0,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [],
    })
  })

  it('loads detail and related resources from in-memory indexes', async () => {
    stubDatasetFetch()

    await expect(fetchApiResource('location', 1)).resolves.toMatchObject({
      id: 1,
      residents: [
        'https://rickandmortyapi.com/api/character/1',
        'https://rickandmortyapi.com/api/character/2',
      ],
    })

    await expect(fetchApiResources('episode', [2, 1, Number.NaN])).resolves.toMatchObject([
      { id: 2, characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/3'] },
      { id: 1, characters: ['https://rickandmortyapi.com/api/character/1', 'https://rickandmortyapi.com/api/character/2'] },
    ])
  })

  it('throws not found responses for invalid detail ids', async () => {
    stubDatasetFetch()

    await expect(fetchApiResource('character', 999)).rejects.toMatchObject({
      status: 404,
      statusText: 'Not Found',
    })
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

  it('parses CSV edge cases and pipe-delimited IDs', () => {
    expect(parseCsv('id,name,type\n1,"Smith, Summer",\n2,"Quote ""Bird""",Alien\n')).toEqual([
      { id: '1', name: 'Smith, Summer', type: '' },
      { id: '2', name: 'Quote "Bird"', type: 'Alien' },
    ])

    expect(parsePipeIds('1|2||nope|5')).toEqual([1, 2, 5])
    expect(rewriteCharacterImagePath('images/characters/001-rick.jpeg')).toBe('/data/rick-and-morty/images/characters/001-rick.jpeg')
    expect(rewriteCharacterImagePath('https://rickandmortyapi.com/api/character/avatar/3.jpeg')).toBe('/data/rick-and-morty/images/characters/3.jpeg')
  })

  it('reuses the in-memory dataset after the first load', async () => {
    stubDatasetFetch()

    await fetchApiResource('character', 1)
    expect(fetch).toHaveBeenCalledTimes(4)

    await fetchApiResource('character', 2)

    expect(fetch).toHaveBeenCalledTimes(4)
  })
})
