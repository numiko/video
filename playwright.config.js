// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  // Run tests in files in parallel.
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,
  // Reporters: console list, HTML report, and JUnit XML for CI.
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: './reports/results.xml' }],
  ],
  use: {
    // Record a trace on retry — useful for diagnosing CI failures.
    trace: 'on-first-retry',
  },
  // Single chrome project — we use channel:'chrome' (real Chrome, not bundled
  // Chromium) because Vimeo's headless detection blocks playback otherwise.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  /**
   * Run the local dev server before starting the tests. Reuses an existing server
   * locally if one is already running, but always starts a fresh one in CI.
   */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
