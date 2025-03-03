/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/',
    defaultCommandTimeout: 10000,
    viewportWidth: 1400,
    setupNodeEvents(on, config) {},
  },
});
