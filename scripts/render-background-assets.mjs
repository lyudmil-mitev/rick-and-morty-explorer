#!/usr/bin/env node

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const darkBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 480" preserveAspectRatio="xMidYMid slice">
  <filter id="filter">
    <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="8" seed="4"/>
    <feDisplacementMap scale="80"/>
    <feColorMatrix values="1 0 0 0 0
                           0 1 0 0 0
                           0 0 1 0 0
                           0 0 0 1.2 -.2"/>
    <feColorMatrix values="2 0 0 0 -.6
                           .1 0 .6 .5 -.5
                           0 0 .1 0 .1
                           0 0 0 1 0" result="n"/>
    <feTurbulence baseFrequency=".2" result="s"/>
    <feTurbulence baseFrequency=".1"/>
    <feBlend in="s"/>
    <feColorMatrix values="0 0 0 9 -6
                           0 0 0 9 -6
                           0 0 0 9 -6
                           0 0 0 0 1"/>
    <feBlend in="n"/>
  </filter>
  <rect width="1920" height="480" filter="url(#filter)"/>
</svg>`;

const lightBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 360" preserveAspectRatio="none">
  <defs>
    <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#eaffd1"/>
      <stop offset="45%" stop-color="#9ff4d5"/>
      <stop offset="100%" stop-color="#eef2ed"/>
    </linearGradient>
    <linearGradient id="fade" x2="0" y2="1">
      <stop stop-color="#102030" stop-opacity=".46"/>
      <stop offset="100%" stop-color="#102030" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="haze" x1="0" x2="1" y1="0" y2="0">
      <stop stop-color="#08bae3" stop-opacity=".16"/>
      <stop offset="48%" stop-color="#b7ff44" stop-opacity=".24"/>
      <stop offset="100%" stop-color="#ff4fa3" stop-opacity=".12"/>
    </linearGradient>
    <filter id="terrainNoise">
      <feComponentTransfer>
        <feFuncA type="discrete" tableValues="0 0 .17 .37 .5 .57 .33 1 1"/>
      </feComponentTransfer>
      <feColorMatrix values="0 0 0 .06 0
                             0 0 0 .85 .02
                             0 0 0 .45 .02
                             0 0 0 0 1" result="s"/>
      <feTurbulence type="fractalNoise" baseFrequency=".005" numOctaves="2"/>
      <feDisplacementMap in="s" scale="99"/>
    </filter>
    <filter id="softBlur">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>

  <rect width="1600" height="360" fill="url(#sky)"/>
  <rect x="-20%" y="-5%" width="120%" height="122%" fill="url(#fade)" filter="url(#terrainNoise)" opacity=".5"/>
  <rect width="1600" height="360" fill="url(#haze)"/>
</svg>`;

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const outputDir = path.join(projectRoot, 'public', 'backgrounds')
const sources = {
  dark: darkBannerSvg,
  light: lightBannerSvg,
}

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })

  for (const [theme, svg] of Object.entries(sources)) {
    await renderBackground(page, {
      path: path.join(outputDir, `banner-${theme}.jpg`),
      svg,
      width: 1920,
      height: 480,
      backgroundColor: theme === 'dark' ? '#070b18' : '#eef2ed',
    })

    await renderBackground(page, {
      path: path.join(outputDir, `splash-${theme}.jpg`),
      svg,
      width: 1920,
      height: 1080,
      backgroundColor: theme === 'dark' ? '#070b18' : '#eef2ed',
      overlay: theme === 'dark'
        ? 'radial-gradient(circle at 50% 42%, rgba(0, 0, 0, 0) 0 50vmin, rgba(0, 0, 0, 0.92) 64vmin, rgba(0, 0, 0, 0.99) 100vmax)'
        : 'radial-gradient(circle at 50% 42%, rgba(251, 250, 242, 0) 0 50vmin, rgba(251, 250, 242, 0.92) 64vmin, rgba(251, 250, 242, 0.99) 100vmax)',
    })
  }
} finally {
  await browser.close()
}

async function renderBackground(page, options) {
  const svgUrl = `data:image/svg+xml,${encodeURIComponent(options.svg)}`
  const backgroundImage = options.overlay
    ? `${options.overlay}, url("${svgUrl}")`
    : `url("${svgUrl}")`

  await page.setViewportSize({ width: options.width, height: options.height })
  await page.setContent(`<!doctype html>
    <html>
      <head>
        <style>
          html,
          body,
          #render-target {
            width: ${options.width}px;
            height: ${options.height}px;
            margin: 0;
            overflow: hidden;
          }

          #render-target {
            background-color: ${options.backgroundColor};
            background-image: ${backgroundImage};
            background-position: center;
            background-repeat: no-repeat;
            background-size: ${options.overlay ? '100% 100%, cover' : 'cover'};
          }
        </style>
      </head>
      <body>
        <div id="render-target"></div>
      </body>
    </html>`)

  await page.locator('#render-target').screenshot({
    path: options.path,
    type: 'jpeg',
    quality: 86,
  })
}
