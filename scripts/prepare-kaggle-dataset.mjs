#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DATASET_SLUG = 'robbroadhead/rick-and-morty-api-dataset'
const DETAILS_DATASET_SLUG = 'robbroadhead/rick-and-morty-details-fandom-wiki-dataset'
const GITHUB_REPOSITORY = 'lyudmil-mitev/rick-and-morty-explorer'
const REQUIRED_CSVS = [
  'characters.csv',
  'locations.csv',
  'episodes.csv',
  'character_episodes.csv',
  'location_residents.csv',
]
const REQUIRED_DETAILS_CSVS = [
  'characters_source_material.csv',
  'locations_source_material.csv',
  'episodes_source_material.csv',
  'sources.csv',
]
const DETAILS_RESOURCES = ['characters', 'locations', 'episodes']

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const options = parseArgs(process.argv.slice(2))
const downloadDir = path.resolve(projectRoot, options.downloadDir)
const detailsDownloadDir = path.resolve(projectRoot, options.detailsDownloadDir)
const publicDataDir = path.resolve(projectRoot, 'public/data/rick-and-morty')
const targetImageDir = path.join(publicDataDir, 'images', 'characters')
const publicDetailsDir = path.join(publicDataDir, 'details')

assertSafeGeneratedPath(downloadDir)
assertSafeGeneratedPath(detailsDownloadDir)

if (options.ifMissing && await hasPreparedDataset()) {
  console.log(`Using existing ${DATASET_SLUG} and ${DETAILS_DATASET_SLUG} datasets in ${path.relative(projectRoot, publicDataDir)}`)
} else {
  await prepareDataset()
}

async function prepareDataset() {
  let releaseInstalled = false
  let releaseError = null

  if (options.ifMissing) {
    try {
      await resetBaseDatasetDirectories()
      await downloadReleaseDatasetArchive()
      await installDatasetFromDirectory(await findPreparedDatasetDirectory(downloadDir))
      releaseInstalled = true
      if (await hasPreparedDataset()) {
        console.log(`Prepared ${DATASET_SLUG} from the latest GitHub release in ${path.relative(projectRoot, publicDataDir)}`)
        return
      }

      console.warn('Latest GitHub release dataset did not include prepared details JSON; falling back to Kaggle for details data.')
    } catch (error) {
      releaseError = error
      console.warn(`GitHub release dataset download failed: ${formatError(error)}`)
    }
  }

  const credentials = await readKaggleCredentials()
  if (!credentials) {
    const releaseMessage = releaseError ? ` Latest GitHub release fallback failed: ${formatError(releaseError)}.` : ''
    throw new Error(`${releaseMessage} Set KAGGLE_USERNAME and KAGGLE_KEY before running dataset:prepare.`.trim())
  }

  if (!releaseInstalled) {
    await resetBaseDatasetDirectories()
    await downloadKaggleDatasetArchive(DATASET_SLUG, downloadDir, 'kaggle-dataset.zip', credentials)
    await installDatasetFromDirectory(downloadDir)
    console.log(`Prepared ${DATASET_SLUG} in ${path.relative(projectRoot, publicDataDir)}`)
  }

  await resetDetailsDatasetDirectory()
  await downloadKaggleDatasetArchive(DETAILS_DATASET_SLUG, detailsDownloadDir, 'details-dataset.zip', credentials)
  const detailsSummary = await generateDetailsRuntimeDataset(await findDetailsDatasetDirectory(detailsDownloadDir))
  await updateManifestWithRuntimeDetails(detailsSummary)
  console.log(`Prepared ${DETAILS_DATASET_SLUG} in ${path.relative(projectRoot, publicDetailsDir)}`)
}

async function readKaggleCredentials() {
  const username = process.env.KAGGLE_USERNAME?.trim() || await readDotEnvValue('KAGGLE_USERNAME')
  const key = process.env.KAGGLE_KEY?.trim() || process.env.KAGGLE_API_TOKEN?.trim() || await readDotEnvValue('KAGGLE_KEY') || await readDotEnvValue('KAGGLE_API_TOKEN')

  return username && key ? { username, key } : null
}

async function resetBaseDatasetDirectories() {
  await rm(downloadDir, { recursive: true, force: true })
  await rm(publicDataDir, { recursive: true, force: true })
  await mkdir(downloadDir, { recursive: true })
  await mkdir(publicDataDir, { recursive: true })
}

async function resetDetailsDatasetDirectory() {
  await rm(detailsDownloadDir, { recursive: true, force: true })
  await rm(publicDetailsDir, { recursive: true, force: true })
  await mkdir(detailsDownloadDir, { recursive: true })
  await mkdir(publicDetailsDir, { recursive: true })
}

async function installDatasetFromDirectory(sourceDataDir) {
  for (const fileName of REQUIRED_CSVS) {
    await copyRequired(path.join(sourceDataDir, fileName), path.join(publicDataDir, fileName))
  }

  const sourceImageDir = path.join(sourceDataDir, 'images', 'characters')
  await assertDirectory(sourceImageDir)
  await cp(sourceImageDir, targetImageDir, { recursive: true })

  const imageCount = await countFiles(targetImageDir)
  const detailsSummary = await installPreparedDetailsFromDirectory(sourceDataDir)
  const manifest = {
    dataset: DATASET_SLUG,
    generatedAt: new Date().toISOString(),
    cacheVersion: `${DATASET_SLUG}:${Date.now()}`,
    files: REQUIRED_CSVS,
    images: {
      characters: imageCount,
    },
  }

  if (detailsSummary) {
    manifest.details = detailsSummary
  }

  await writeFile(path.join(publicDataDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
}

async function updateManifestWithRuntimeDetails(detailsSummary) {
  const manifestPath = path.join(publicDataDir, 'manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  manifest.details = detailsSummary

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

async function installPreparedDetailsFromDirectory(sourceDataDir) {
  const sourceDetailsDir = path.join(sourceDataDir, 'details')
  if (!await isDirectory(sourceDetailsDir)) {
    return null
  }

  await rm(publicDetailsDir, { recursive: true, force: true })
  await cp(sourceDetailsDir, publicDetailsDir, { recursive: true })
  return summarizeDetailsRuntimeDataset()
}

async function generateDetailsRuntimeDataset(sourceDataDir) {
  const [sourceRows, characterRows, locationRows, episodeRows] = await Promise.all([
    readCsv(path.join(sourceDataDir, 'sources.csv')),
    readCsv(path.join(sourceDataDir, 'characters_source_material.csv')),
    readCsv(path.join(sourceDataDir, 'locations_source_material.csv')),
    readCsv(path.join(sourceDataDir, 'episodes_source_material.csv')),
  ])
  const sourceMap = new Map(sourceRows.map((row) => [row.id, toDetailsSource(row)]))
  const files = []
  const statuses = {}

  await Promise.all([
    mkdir(path.join(publicDetailsDir, 'characters'), { recursive: true }),
    mkdir(path.join(publicDetailsDir, 'locations'), { recursive: true }),
    mkdir(path.join(publicDetailsDir, 'episodes'), { recursive: true }),
  ])

  for (const row of characterRows) {
    const record = toRuntimeDetailsRecord(row, 'description', 'description_source_text', sourceMap)
    const fileName = `characters/${record.id}.json`
    await writeDetailsRecord(fileName, record)
    files.push(fileName)
    incrementStatus(statuses, record.status)
  }

  for (const row of locationRows) {
    const record = toRuntimeDetailsRecord(row, 'description', 'description_source_text', sourceMap)
    const fileName = `locations/${record.id}.json`
    await writeDetailsRecord(fileName, record)
    files.push(fileName)
    incrementStatus(statuses, record.status)
  }

  for (const row of episodeRows) {
    const record = toRuntimeDetailsRecord(row, 'synopsis', 'synopsis_source_text', sourceMap)
    const fileName = `episodes/${record.id}.json`
    await writeDetailsRecord(fileName, record)
    files.push(fileName)
    incrementStatus(statuses, record.status)
  }

  return {
    dataset: DETAILS_DATASET_SLUG,
    path: 'details',
    files,
    counts: {
      characters: characterRows.length,
      locations: locationRows.length,
      episodes: episodeRows.length,
    },
    statuses,
  }
}

async function summarizeDetailsRuntimeDataset() {
  const files = []
  const counts = Object.fromEntries(DETAILS_RESOURCES.map((resource) => [resource, 0]))
  const statuses = {}

  for (const resource of DETAILS_RESOURCES) {
    const resourceDir = path.join(publicDetailsDir, resource)
    if (!await isDirectory(resourceDir)) {
      return null
    }

    const entries = await readdir(resourceDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) {
        continue
      }

      const fileName = `${resource}/${entry.name}`
      files.push(fileName)
      counts[resource] += 1

      const record = JSON.parse(await readFile(path.join(publicDetailsDir, fileName), 'utf8'))
      incrementStatus(statuses, record.status || 'unknown')
    }
  }

  if (files.length === 0) {
    return null
  }

  return {
    dataset: DETAILS_DATASET_SLUG,
    path: 'details',
    files: files.sort(),
    counts,
    statuses,
  }
}

async function writeDetailsRecord(fileName, record) {
  await writeFile(path.join(publicDetailsDir, fileName), `${JSON.stringify(record, null, 2)}\n`)
}

function toRuntimeDetailsRecord(row, textType, textField, sourceMap) {
  const status = row.status || 'needs_review'
  const isDisplayable = status === 'ok' || status === 'contextual_source' || status === 'alias_match'

  return {
    id: parseId(row.id),
    status,
    textType,
    wikiTitle: row.wiki_title || null,
    wikiUrl: row.wiki_url || null,
    text: isDisplayable ? row[textField] : '',
    sources: parsePipeValues(row.source_ids).flatMap((sourceId) => {
      const source = sourceMap.get(sourceId)
      return source ? [source] : []
    }),
    notes: row.notes || '',
  }
}

function toDetailsSource(row) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    publisher: row.publisher,
    sourceType: row.sourceType,
    retrievedAt: row.retrievedAt,
  }
}

function incrementStatus(statuses, status) {
  statuses[status] = (statuses[status] ?? 0) + 1
}

async function hasPreparedDataset() {
  try {
    for (const fileName of [...REQUIRED_CSVS, 'manifest.json']) {
      await assertFile(path.join(publicDataDir, fileName))
    }

    await assertDirectory(targetImageDir)
    const detailsSummary = await summarizeDetailsRuntimeDataset()
    if (!detailsSummary) {
      return false
    }

    return await countFiles(targetImageDir) > 0
  } catch {
    return false
  }
}

async function findPreparedDatasetDirectory(rootDirectory) {
  const queue = [rootDirectory]

  while (queue.length > 0) {
    const currentDirectory = queue.shift()
    if (await hasDatasetFiles(currentDirectory)) {
      return currentDirectory
    }

    const entries = await readdir(currentDirectory, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        queue.push(path.join(currentDirectory, entry.name))
      }
    }
  }

  throw new Error('Release archive does not contain the expected CSV files and images/characters directory.')
}

async function findDetailsDatasetDirectory(rootDirectory) {
  const queue = [rootDirectory]

  while (queue.length > 0) {
    const currentDirectory = queue.shift()
    if (await hasDetailsDatasetFiles(currentDirectory)) {
      return currentDirectory
    }

    const entries = await readdir(currentDirectory, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        queue.push(path.join(currentDirectory, entry.name))
      }
    }
  }

  throw new Error('Details dataset archive does not contain the expected source-material CSV files.')
}

async function hasDatasetFiles(directory) {
  try {
    for (const fileName of REQUIRED_CSVS) {
      await assertFile(path.join(directory, fileName))
    }

    await assertDirectory(path.join(directory, 'images', 'characters'))
    return true
  } catch {
    return false
  }
}

async function hasDetailsDatasetFiles(directory) {
  try {
    for (const fileName of REQUIRED_DETAILS_CSVS) {
      await assertFile(path.join(directory, fileName))
    }

    return true
  } catch {
    return false
  }
}

async function isDirectory(directory) {
  try {
    const stats = await stat(directory)
    return stats.isDirectory()
  } catch {
    return false
  }
}

async function copyRequired(source, target) {
  await assertFile(source)
  await cp(source, target)
}

async function assertFile(filePath) {
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      return
    }
  } catch {
    // handled below
  }

  throw new Error(`Missing required dataset file: ${path.relative(projectRoot, filePath)}`)
}

async function assertDirectory(directory) {
  try {
    const stats = await stat(directory)
    if (stats.isDirectory()) {
      return
    }
  } catch {
    // handled below
  }

  throw new Error(`Missing required dataset directory: ${path.relative(projectRoot, directory)}`)
}

async function countFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  let count = 0

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      count += await countFiles(entryPath)
    } else if (entry.isFile()) {
      count += 1
    }
  }

  return count
}

async function downloadReleaseDatasetArchive() {
  const archiveUrl = await resolveReleaseDatasetArchiveUrl()
  const archivePath = path.join(downloadDir, 'release-dataset.zip')

  await downloadArchive(archiveUrl, archivePath)
  await run('unzip', ['-q', archivePath, '-d', downloadDir], process.env)
}

async function resolveReleaseDatasetArchiveUrl() {
  const configuredUrl = process.env.DATASET_RELEASE_URL?.trim() || await readDotEnvValue('DATASET_RELEASE_URL')
  if (configuredUrl) {
    return configuredUrl
  }

  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/latest`, {
    headers: {
      accept: 'application/vnd.github+json',
      'user-agent': 'rick-and-morty-explorer-dataset-prep',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub latest release lookup failed with ${response.status} ${response.statusText}`)
  }

  const release = await response.json()
  const assets = Array.isArray(release.assets) ? release.assets : []
  const zipAssets = assets.filter((asset) => (
    typeof asset.name === 'string' &&
    typeof asset.browser_download_url === 'string' &&
    asset.name.endsWith('.zip')
  ))
  const releaseAsset = zipAssets.find((asset) => /rick.*morty|dataset|data/i.test(asset.name)) ?? zipAssets[0]

  if (!releaseAsset) {
    throw new Error('Latest GitHub release does not include a .zip dataset asset.')
  }

  return releaseAsset.browser_download_url
}

async function downloadKaggleDatasetArchive(datasetSlug, targetDirectory, archiveName, credentials) {
  const archivePath = path.join(targetDirectory, archiveName)

  await downloadArchive(`https://www.kaggle.com/api/v1/datasets/download/${datasetSlug}`, archivePath, {
    authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.key}`).toString('base64')}`,
  })
  await run('unzip', ['-q', archivePath, '-d', targetDirectory], process.env)
}

async function downloadArchive(url, archivePath, headers = {}) {
  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`${url} failed with ${response.status} ${response.statusText}`)
  }

  await writeFile(archivePath, Buffer.from(await response.arrayBuffer()))
}

async function readCsv(filePath) {
  return parseCsv(await readFile(filePath, 'utf8'))
}

function parseCsv(text) {
  const rows = []
  let row = []
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

function parsePipeValues(value) {
  return (value ?? '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseId(value) {
  const id = Number.parseInt(value, 10)
  if (!Number.isFinite(id) || id < 1) {
    throw new Error(`Invalid details id: ${value}`)
  }

  return id
}

async function readDotEnvValue(key) {
  try {
    const envFile = await readFile(path.join(projectRoot, '.env'), 'utf8')
    const line = envFile
      .split(/\r?\n/)
      .map((rawLine) => rawLine.trim())
      .find((rawLine) => rawLine.startsWith(`${key}=`))

    if (!line) {
      return null
    }

    const value = line.slice(key.length + 1).trim()
    return unquoteEnvValue(value)
  } catch {
    return null
  }
}

function unquoteEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function assertSafeGeneratedPath(directory) {
  const relativePath = path.relative(projectRoot, directory)
  if (
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath) ||
    relativePath === '' ||
    (!relativePath.startsWith('.kaggle/') && !relativePath.startsWith('kaggle-dataset/'))
  ) {
    throw new Error(`Refusing to use unsafe generated dataset directory: ${relativePath || '.'}`)
  }
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error)
}

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      env,
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
      }
    })
  })
}

function parseArgs(args) {
  const parsed = {
    downloadDir: '.kaggle/rick-and-morty-api-dataset',
    detailsDownloadDir: '.kaggle/rick-and-morty-details-fandom-wiki-dataset',
    ifMissing: false,
  }

  for (const arg of args) {
    if (arg.startsWith('--download-dir=')) {
      parsed.downloadDir = arg.slice('--download-dir='.length)
    } else if (arg.startsWith('--details-download-dir=')) {
      parsed.detailsDownloadDir = arg.slice('--details-download-dir='.length)
    } else if (arg === '--if-missing') {
      parsed.ifMissing = true
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  return parsed
}
