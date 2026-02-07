import { defineConfig } from 'vitest/config';
import { vitestClarinet } from 'vitest-environment-clarinet';

export default defineConfig({
  test: {
    pool: 'threads',
    coverage: {
      enabled: false,
      reporter: ['text', 'json'],
      reportsDirectory: './coverage',
    },
    environmentOptions: {
      clarinet: {
        costs: false,
        coverage: false,
      }
    },
    environment: 'clarinet',
  },
});
