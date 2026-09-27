import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/integration/**/*.spec.ts', '**/e2e/**/*.spec.ts', '**/visual/**/*.spec.ts'],
  testIgnore: [
    '**/integration/contact-*.spec.ts',
    '**/integration/health-endpoint.spec.ts',
    '**/integration/release-readiness.spec.ts',
  ],
  timeout: 30_000,
  retries: process.env['CI'] ? 1 : 0,
  workers: 2,
  forbidOnly: Boolean(process.env['CI']),
  use: {
    // A dedicated port guarantees that assertions exercise the packaged
    // standalone server, never a developer's already-running `astro dev`.
    baseURL: 'http://127.0.0.1:4311',
    trace: 'retain-on-failure',
  },
  ...(process.env['RUN_CONTAINER_TESTS']
    ? {}
    : {
        webServer: {
          command: 'pnpm run build && PORT=4311 pnpm run start',
          url: 'http://127.0.0.1:4311/api/salud',
          reuseExistingServer: false,
        },
      }),
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'no-js-chromium', use: { ...devices['Desktop Chrome'], javaScriptEnabled: false } },
    { name: 'reduced-motion-chromium', use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' } },
  ],
});
