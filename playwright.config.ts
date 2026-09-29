import { defineConfig, devices } from '@playwright/test';

const testEnvironment = (process.env.TEST_ENV || 'shqa').trim().toLowerCase();
const runTimestamp = new Date().toISOString();
const reportTimestamp = runTimestamp.replace(/[:.]/g, '-');
const reportFolder = `playwright-report/${testEnvironment}-${reportTimestamp}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [
      'html',
      {
        outputFolder: reportFolder,
        open: 'never',
        title: `CarePro Test Report | ${testEnvironment} | ${runTimestamp} UTC`,
      },
    ],
    ['json', { outputFile: 'test-results/results.json' }],
    [
      './reporters/pie-chart-reporter.ts',
      {
        reportFolder,
        testEnvironment,
        runTimestamp,
        open: !process.env.CI,
      },
    ],
  ],
  use: {
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
});
