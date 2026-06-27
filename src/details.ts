export type DetailsStatus = 'ok' | 'contextual_source' | 'alias_match' | 'insufficient_source' | string
export type DetailsResource = 'characters' | 'locations' | 'episodes'
export type DetailsTextType = 'description' | 'synopsis'

export type DetailsSource = {
  id: string
  title: string
  url: string
  publisher: string
  sourceType: string
  retrievedAt: string
}

export type DetailsRecord = {
  id: number
  status: DetailsStatus
  textType: DetailsTextType
  wikiTitle: string | null
  wikiUrl: string | null
  text: string
  sources: DetailsSource[]
  notes: string
}

const DETAILS_PATH = 'data/rick-and-morty/details/'

export function isDisplayableDetails(details: DetailsRecord | null | undefined): details is DetailsRecord {
  return Boolean(
    details &&
    details.text.trim().length > 0 &&
    (details.status === 'ok' || details.status === 'contextual_source' || details.status === 'alias_match'),
  )
}

export async function fetchDetailsResource(resource: DetailsResource, id: number, signal?: AbortSignal) {
  const response = await fetch(detailsUrl(`${resource}/${id}.json`), { signal })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to load details ${resource}/${id}: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<DetailsRecord>
}

function detailsUrl(fileName: string) {
  return `${import.meta.env.BASE_URL}${DETAILS_PATH}${fileName}`
}
