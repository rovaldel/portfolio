import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'tests/integration/contact-submission.spec.ts',
      'tests/integration/contact-api.spec.ts',
      'tests/integration/contact-legal-pages.spec.ts',
      'tests/integration/health-endpoint.spec.ts',
      'tests/integration/release-readiness.spec.ts',
    ],
  },
});
