// @ts-check
const { defineConfig, devices } = require('@playwright/test')

// Antes de lanzar las pruebas:
//   backend:  npm run start:test   (en part4/bloglist-backend, puerto 3003)
//   frontend: npm run dev          (en part5/bloglist-frontend, puerto 5173)
module.exports = defineConfig({
  testDir: './tests',
  timeout: 10000,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
