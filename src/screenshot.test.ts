import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, rmSync } from 'node:fs';

const basePath = '/rick-and-morty-explorer';
const themes = ['light', 'dark'] as const;
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;
const routes = [
  { path: '/', readyHeading: 'Rick and Morty Explorer' },
  { path: '/characters', readyHeading: 'Characters' },
  { path: '/locations', readyHeading: 'Locations' },
  { path: '/episodes', readyHeading: 'Episodes' },
  { path: '/about', readyHeading: 'Rick and Morty Explorer' },
  { path: '/characters/1', readyHeading: 'Rick Sanchez' },
  { path: '/locations/1', readyHeading: 'Earth (C-137)' },
  { path: '/episodes/1', readyHeading: 'Pilot' },
] as const;

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

async function waitForPageReady(page: Page, heading: string) {
  await expect(page.locator('main').getByRole('heading', { name: heading }).first()).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts?.ready;
    const visibleImages = Array.from(document.images).filter((image) => image.checkVisibility?.() ?? image.offsetParent !== null);

    await Promise.all(visibleImages.map((image) => {
      if (image.complete) {
        return undefined;
      }

      return new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      });
    }));
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
          for (const route of routes) {
            const url = getUrl(route.path);
            const filename = getScreenshotPath(theme, viewport.name, route.path);

            test(`captures ${route.path} page in ${theme} mode on ${viewport.name}`, async ({ page }) => {
              await page.setViewportSize(viewport);
              await page.emulateMedia({ colorScheme: theme });
              await page.goto(url, { waitUntil: 'domcontentloaded' });
              await waitForPageReady(page, route.readyHeading);
              await page.screenshot({ path: filename, fullPage: true });
            });
          }
        });
      }
    });
  }
});
