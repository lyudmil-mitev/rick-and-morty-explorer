import type { Character, Episode, Location } from './rickmorty'
import type { ApiResource, PaginatedResponse } from './api'

const DATASET_PATH = 'data/rick-and-morty/'
const PAGE_SIZE = 20

type DatasetManifest = {
  dataset: string
  generatedAt: string
  cacheVersion: string
  files: string[]
}

type CsvRow = Record<string, string>

type DatasetRecords = {
  characters: Character[]
  locations: Location[]
  episodes: Episode[]
}

type DatasetIndexes = {
  character: Map<number, Character>
  location: Map<number, Location>
  episode: Map<number, Episode>
}

type DatasetState = DatasetRecords & {
  indexes: DatasetIndexes
}

let statePromise: Promise<DatasetState> | null = null

export async function loadDataset(signal?: AbortSignal) {
  signal?.throwIfAborted()

  if (!statePromise) {
    statePromise = loadDatasetState(signal).catch((error) => {
      statePromise = null
      throw error
    })
  }

  return statePromise
}

export function resetDatasetForTests() {
  statePromise = null
}

export async function getResource<T>(resource: ApiResource, id: number, signal?: AbortSignal) {
  const state = await loadDataset(signal)
  return getMap(state.indexes, resource).get(id) as T | undefined
}

export async function getResources<T>(resource: ApiResource, ids: number[], signal?: AbortSignal) {
  const state = await loadDataset(signal)
  const map = getMap(state.indexes, resource)
  return ids.flatMap((id) => {
    const record = map.get(id)
    return record ? [record as T] : []
  })
}

export async function getPaginatedResource<T>(
  resource: ApiResource,
  page: number,
  filters = new URLSearchParams(),
  signal?: AbortSignal,
): Promise<PaginatedResponse<T>> {
  const state = await loadDataset(signal)
  const records = getRecords(state, resource)
  const filtered = applyFilters(records as Array<Character | Location | Episode>, filters)
  const pages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1)
  const currentPage = Math.min(Math.max(page, 1), pages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageResults = filtered.slice(start, start + PAGE_SIZE) as T[]

  return {
    info: {
      count: filtered.length,
      pages,
      next: currentPage < pages ? `${resource}?page=${currentPage + 1}` : null,
      prev: currentPage > 1 ? `${resource}?page=${currentPage - 1}` : null,
    },
    results: pageResults,
  }
}

export function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"'
        index += 1
      } else if (char === '"') {
        quoted = false
      } else {
        cell += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  const [headers = [], ...body] = rows
  return body
    .filter((values) => values.some((value) => value.length > 0))
    .map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])))
}

export function parsePipeIds(value: string | undefined) {
  return (value ?? '')
    .split('|')
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id) && id > 0)
}

export function rewriteCharacterImagePath(value: string | undefined, id?: number) {
  const imagePath = normalizeImagePath(value, id)
  return imagePath ? datasetUrl(imagePath) : ''
}

async function loadDatasetState(signal?: AbortSignal): Promise<DatasetState> {
  await fetchJson<DatasetManifest>('manifest.json', signal)
  const records = await fetchRecords(signal)

  return {
    ...records,
    indexes: {
      character: indexById(records.characters),
      location: indexById(records.locations),
      episode: indexById(records.episodes),
    },
  }
}

async function fetchRecords(signal?: AbortSignal) {
  const [
    characterRows,
    locationRows,
    episodeRows,
  ] = await Promise.all([
    fetchCsv('characters.csv', signal),
    fetchCsv('locations.csv', signal),
    fetchCsv('episodes.csv', signal),
  ])

  return {
    characters: characterRows.map((row) => toCharacter(row, parsePipeIds(row.episode_ids))),
    locations: locationRows.map((row) => toLocation(row, parsePipeIds(row.resident_ids))),
    episodes: episodeRows.map((row) => toEpisode(row, parsePipeIds(row.character_ids))),
  }
}

async function fetchJson<T>(fileName: string, signal?: AbortSignal) {
  const response = await fetch(datasetUrl(fileName), { signal })
  if (!response.ok) {
    throw new Error(`Failed to load dataset ${fileName}: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

async function fetchCsv(fileName: string, signal?: AbortSignal) {
  const response = await fetch(datasetUrl(fileName), { signal })
  if (!response.ok) {
    throw new Error(`Failed to load dataset ${fileName}: ${response.status} ${response.statusText}`)
  }

  return parseCsv(await response.text())
}

function toCharacter(row: CsvRow, episodeIds: number[]): Character {
  const id = parseId(row.id)
  const originId = parseOptionalId(row.origin_id)
  const locationId = parseOptionalId(row.location_id)

  return {
    id,
    name: row.name,
    status: normalizeStatus(row.status),
    species: row.species,
    type: row.type,
    gender: normalizeGender(row.gender),
    origin: {
      name: row.origin_name,
      url: originId ? apiUrl('location', originId) : '',
    },
    location: {
      name: row.location_name,
      url: locationId ? apiUrl('location', locationId) : '',
    },
    image: rewriteCharacterImagePath(row.image_file || row.image || row.image_url, id),
    episode: episodeIds.map((episodeId) => apiUrl('episode', episodeId)),
    url: apiUrl('character', id),
    created: row.created,
  }
}

function toLocation(row: CsvRow, residentIds: number[]): Location {
  const id = parseId(row.id)

  return {
    id,
    name: row.name,
    type: row.type,
    dimension: row.dimension,
    residents: residentIds.map((characterId) => apiUrl('character', characterId)),
    url: apiUrl('location', id),
    created: row.created,
  }
}

function toEpisode(row: CsvRow, characterIds: number[]): Episode {
  const id = parseId(row.id)

  return {
    id,
    name: row.name,
    air_date: row.air_date,
    episode: row.episode,
    characters: characterIds.map((characterId) => apiUrl('character', characterId)),
    url: apiUrl('episode', id),
    created: row.created,
  }
}

function applyFilters<T extends Character | Location | Episode>(records: T[], filters: URLSearchParams) {
  const activeFilters = Array.from(filters.entries()).filter(([, value]) => value.trim().length > 0)

  if (activeFilters.length === 0) {
    return records
  }

  return records.filter((record) => activeFilters.every(([key, value]) => fieldMatches(record, key, value)))
}

function fieldMatches(record: Character | Location | Episode, key: string, value: string) {
  const normalizedValue = normalize(value)

  if (key === 'status' && 'status' in record) {
    return normalize(record.status) === normalizedValue
  }

  if (key === 'gender' && 'gender' in record) {
    return normalize(record.gender) === normalizedValue
  }

  const field = record[key as keyof typeof record]
  return typeof field === 'string' && normalize(field).includes(normalizedValue)
}

function getRecords(state: DatasetState, resource: ApiResource) {
  if (resource === 'character') {
    return state.characters
  }

  if (resource === 'location') {
    return state.locations
  }

  return state.episodes
}

function getMap(indexes: DatasetIndexes, resource: ApiResource) {
  if (resource === 'character') {
    return indexes.character
  }

  if (resource === 'location') {
    return indexes.location
  }

  return indexes.episode
}

function indexById<T extends { id: number }>(records: T[]) {
  return new Map(records.map((record) => [record.id, record]))
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function parseId(value: string) {
  const id = Number.parseInt(value, 10)
  if (!Number.isFinite(id) || id < 1) {
    throw new Error(`Invalid dataset id: ${value}`)
  }

  return id
}

function parseOptionalId(value: string | undefined) {
  const id = Number.parseInt(value ?? '', 10)
  return Number.isFinite(id) && id > 0 ? id : null
}

function normalizeStatus(value: string): Character['status'] {
  return value === 'Dead' || value === 'Alive' || value === 'unknown' ? value : 'unknown'
}

function normalizeGender(value: string): Character['gender'] {
  return value === 'Female' || value === 'Male' || value === 'Genderless' || value === 'unknown' ? value : 'unknown'
}

function normalizeImagePath(value: string | undefined, id?: number) {
  if (!value) {
    return id ? `images/characters/${id}.jpeg` : ''
  }

  try {
    const url = new URL(value)
    const fileName = url.pathname.split('/').pop()
    return fileName ? `images/characters/${fileName}` : ''
  } catch {
    const cleanValue = value.replace(/^\/+/, '')
    const marker = 'images/characters/'
    const markerIndex = cleanValue.indexOf(marker)
    return markerIndex >= 0 ? cleanValue.slice(markerIndex) : `${marker}${cleanValue.split('/').pop() ?? cleanValue}`
  }
}

function apiUrl(resource: ApiResource, id: number) {
  return `https://rickandmortyapi.com/api/${resource}/${id}`
}

function datasetUrl(fileName: string) {
  return `${import.meta.env.BASE_URL}${DATASET_PATH}${fileName}`
}
