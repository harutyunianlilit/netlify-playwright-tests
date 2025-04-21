import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json', { outputFile: 'test-results.json' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.netlify.com/',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Uncomment and configure if you want to run tests against a local dev server
  // webServer: {
  //   command: 'npm run start', // Adjust this if your project has a different start command
  //   url: 'http://127.0.0.1:3000', // Ensure this is the correct URL for your local server
  //   reuseExistingServer: !process.env.CI, // Use the existing server in CI to avoid redundant starts
  // },
});
