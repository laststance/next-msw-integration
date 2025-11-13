import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Automatically cleanup after each test (React Testing Library)
afterEach(() => {
  cleanup()
})

/**
 * Vitest Setup File
 *
 * This file runs before all tests and sets up the testing environment.
 *
 * Note: MSW setup is not included here because this project doesn't use
 * MSW in unit tests - it only uses MSW in the application itself for
 * development and E2E testing purposes.
 */
