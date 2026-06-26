#!/usr/bin/env node

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DATASET_SLUG = 'robbroadhead/rick-and-morty-api-dataset'
const REQUIRED_CSVS = [
  'characters.csv',
  'locations.csv',
  'episodes.csv',
  'character_episodes.csv',
  'location_residents.csv',
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const options = parseArgs(process.argv.slice(2))
const downloadDir = path.resolve(projectRoot, options.downloadDir)
const publicDataDir = path.resolve(projectRoot, 'public/data/rick-and-morty')

await rm(downloadDir, { recursive: true, force: true })
await rm(publicDataDir, { recursive: true, force: true })
await mkdir(downloadDir, { recursive: true })
await mkdir(publicDataDir, { recursive: true })

const kaggleUsername = process.env.KAGGLE_USERNAME?.trim() || await readDotEnvValue('KAGGLE_USERNAME')
const kaggleKey = process.env.KAGGLE_KEY?.trim() || process.env.KAGGLE_API_TOKEN?.trim() || await readDotEnvValue('KAGGLE_KEY') || await readDotEnvValue('KAGGLE_API_TOKEN')

if (!kaggleUsername || !kaggleKey) {
  throw new Error('Set KAGGLE_USERNAME and KAGGLE_KEY before running dataset:prepare.')
}

await downloadDatasetArchive({ username: kaggleUsername, key: kaggleKey })

for (const fileName of REQUIRED_CSVS) {
  await copyRequired(path.join(downloadDir, fileName), path.join(publicDataDir, fileName))
}

const sourceImageDir = path.join(downloadDir, 'images', 'characters')
const targetImageDir = path.join(publicDataDir, 'images', 'characters')
await assertDirectory(sourceImageDir)
await cp(sourceImageDir, targetImageDir, { recursive: true })

const imageCount = await countFiles(targetImageDir)
const manifest = {
  dataset: DATASET_SLUG,
  generatedAt: new Date().toISOString(),
  cacheVersion: `${DATASET_SLUG}:${Date.now()}`,
  files: REQUIRED_CSVS,
  images: {
    characters: imageCount,
  },
}

await writeFile(path.join(publicDataDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Prepared ${DATASET_SLUG} in ${path.relative(projectRoot, publicDataDir)}`)

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

async function downloadDatasetArchive(credentials) {
  const response = await fetch(`https://www.kaggle.com/api/v1/datasets/download/${DATASET_SLUG}`, {
    headers: {
      authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.key}`).toString('base64')}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Kaggle dataset download failed with ${response.status} ${response.statusText}`)
  }

  const archivePath = path.join(downloadDir, 'dataset.zip')
  await writeFile(archivePath, Buffer.from(await response.arrayBuffer()))
  await run('unzip', ['-q', archivePath, '-d', downloadDir], process.env)
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
  }

  for (const arg of args) {
    if (arg.startsWith('--download-dir=')) {
      parsed.downloadDir = arg.slice('--download-dir='.length)
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  return parsed
}
