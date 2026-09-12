import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:3001', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm exec next start -p 3001',
    cwd: __dirname,
    url: 'http://localhost:3001/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
