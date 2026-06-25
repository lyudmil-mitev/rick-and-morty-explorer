import { test } from '@playwright/test';
import { mkdirSync, rmSync } from 'node:fs';

const basePath = '/rick-and-morty-explorer';
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
              await page.setViewportSize(viewport);
              await page.emulateMedia({ colorScheme: theme });
              await page.goto(`http://localhost:4173${url}`);
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(5000);
              await page.screenshot({ path: filename, fullPage: true });
            });
          }

          for (const route of hiddenRoutes) {
            const url = getUrl(route);
            const filename = getScreenshotPath(theme, viewport.name, route);

            test(`captures detail ${route} page in ${theme} mode on ${viewport.name}`, async ({ page }) => {
              await page.setViewportSize(viewport);
              await page.emulateMedia({ colorScheme: theme });
              await page.goto(`http://localhost:4173${url}`);
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
