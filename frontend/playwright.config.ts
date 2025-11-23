/// <reference types="node" />

import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Directory where Playwright looks for tests
  testDir: './tests', 
  
  // Base URL for your running Angular app
  use: {
    baseURL: 'http://localhost:4200', 
    // You can set other options like browserName, headless, etc. here
    browserName: 'chromium',
  },
  
  // Configure the web server to run before tests start
  webServer: {
    command: 'npx ng serve', // The command to start your Angular app
    url: 'http://localhost:4200',
    timeout: 120 * 1000, // Wait up to 120 seconds for the server to start
    reuseExistingServer: !process.env.CI, // Don't reuse on CI
  },
});