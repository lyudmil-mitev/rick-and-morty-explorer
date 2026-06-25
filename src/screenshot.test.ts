import { test, type Page } from '@playwright/test';
import { mkdirSync, rmSync } from 'node:fs';
import characterDetailMock from './mocks/characterDetail.mock';
import charactersMock from './mocks/characters.mock';
import episodeDetailMock from './mocks/episodeDetail.mock';
import episodesMock from './mocks/episodes.mock';
import locationDetailMock from './mocks/locationDetail.mock';
import locationsMock from './mocks/locations.mock';

const basePath = '/rick-and-morty-explorer';
const screenshotBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4173';
const themes = ['light', 'dark'] as const;
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;
const baseRoutes = [
  '/',
  '/characters',
  '/locations',
  '/episodes',
  '/about',
];

const hiddenRoutes = [
  '/characters/1',
  '/locations/1',
  '/episodes/1',
];

function getUrl(route: string) {
  return `${basePath}${route === '/' ? '/' : route}`;
}

function prepareScreenshotDirectory() {
  rmSync('screenshots', { recursive: true, force: true });
  mkdirSync('screenshots', { recursive: true });
  for (const theme of themes) {
    for (const viewport of viewports) {
      mkdirSync(`screenshots/${theme}/${viewport.name}`, { recursive: true });
    }
  }
}

function getScreenshotPath(theme: typeof themes[number], viewportName: string, route: string) {
  const routePath = route === '/' ? 'page' : `page${route}`;
  return `screenshots/${theme}/${viewportName}/${routePath}.png`;
}

function paginatedResponse<T>(pages: number, results: T[]) {
  return { info: { pages }, results };
}

function findById<T extends { id: number }>(items: T[], id: number, fallback: T) {
  return items.find((item) => item.id === id) ?? fallback;
}

function escapeSvgText(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function avatarPlaceholder(id: number) {
  const character = findById(charactersMock.characters, id, characterDetailMock);
  const initials = character.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <defs>
        <radialGradient id="portal" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#b7ff44"/>
          <stop offset="45%" stop-color="#08bae3"/>
          <stop offset="100%" stop-color="#111827"/>
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="#0f172a"/>
      <circle cx="150" cy="150" r="118" fill="url(#portal)" opacity="0.9"/>
      <circle cx="150" cy="150" r="88" fill="#111827" opacity="0.78"/>
      <text x="150" y="142" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="700" fill="#eaffcc">${escapeSvgText(initials)}</text>
      <text x="150" y="184" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#cffafe">${escapeSvgText(character.status)}</text>
    </svg>
  `;
}

async function mockRickAndMortyApi(page: Page) {
  await page.route('https://rickandmortyapi.com/api/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes('/avatar/')) {
      const id = Number.parseInt(url.pathname.split('/').pop()?.replace(/\D+/g, '') ?? '', 10);
      await route.fulfill({
        contentType: 'image/svg+xml',
        body: avatarPlaceholder(Number.isFinite(id) ? id : characterDetailMock.id),
      });
      return;
    }

    const [resource, rawId] = url.pathname.replace('/api/', '').split('/');

    if (!rawId) {
      if (resource === 'character') {
        await route.fulfill({ json: paginatedResponse(charactersMock.pages, charactersMock.characters) });
        return;
      }

      if (resource === 'location') {
        await route.fulfill({ json: paginatedResponse(locationsMock.pages, locationsMock.locations) });
        return;
      }

      if (resource === 'episode') {
        await route.fulfill({ json: paginatedResponse(episodesMock.pages, episodesMock.episodes) });
        return;
      }
    }

    const ids = rawId.split(',').map((id) => Number.parseInt(id, 10)).filter(Number.isFinite);

    if (resource === 'character') {
      const data = ids.length > 1
        ? ids.map((id) => findById(charactersMock.characters, id, characterDetailMock))
        : findById(charactersMock.characters, ids[0], characterDetailMock);
      await route.fulfill({ json: data });
      return;
    }

    if (resource === 'location') {
      const data = ids.length > 1
        ? ids.map((id) => findById(locationsMock.locations, id, locationDetailMock))
        : findById(locationsMock.locations, ids[0], locationDetailMock);
      await route.fulfill({ json: data });
      return;
    }

    if (resource === 'episode') {
      const data = ids.length > 1
        ? ids.map((id) => findById(episodesMock.episodes, id, episodeDetailMock))
        : findById(episodesMock.episodes, ids[0], episodeDetailMock);
      await route.fulfill({ json: data });
      return;
    }

    await route.fallback();
  });
}

test.describe('Rick and Morty Explorer screenshots', () => {
  test.describe.configure({ mode: 'serial' });
  test.beforeAll(() => {
    prepareScreenshotDirectory();
  });
  for (const theme of themes) {
    test.describe(`${theme} mode`, () => {
      for (const viewport of viewports) {
        test.describe(`${viewport.name} viewport`, () => {
          for (const route of baseRoutes) {
            const url = getUrl(route);
            const filename = getScreenshotPath(theme, viewport.name, route);

            test(`captures ${route} page in ${theme} mode on ${viewport.name}`, async ({ page }) => {
              await mockRickAndMortyApi(page);
              await page.setViewportSize(viewport);
              await page.emulateMedia({ colorScheme: theme });
              await page.goto(`${screenshotBaseUrl}${url}`);
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(5000);
              await page.screenshot({ path: filename, fullPage: true });
            });
          }

          for (const route of hiddenRoutes) {
            const url = getUrl(route);
            const filename = getScreenshotPath(theme, viewport.name, route);

            test(`captures detail ${route} page in ${theme} mode on ${viewport.name}`, async ({ page }) => {
              await mockRickAndMortyApi(page);
              await page.setViewportSize(viewport);
              await page.emulateMedia({ colorScheme: theme });
              await page.goto(`${screenshotBaseUrl}${url}`);
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(5000);
              await page.screenshot({ path: filename, fullPage: true });
            });
          }
        });
      }
    });
  }
});
