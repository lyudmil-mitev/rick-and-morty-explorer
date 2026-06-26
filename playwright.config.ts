import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'src/screenshot.test.ts',
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'npm run dataset:prepare -- --if-missing && npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/rick-and-morty-explorer/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
