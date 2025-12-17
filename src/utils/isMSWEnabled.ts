import { env } from '@/env'

/**
 * Checks if Mock Service Worker (MSW) should be enabled.
 *
 * MSW is enabled when BOTH conditions are met:
 * 1. NEXT_PUBLIC_ENABLE_MSW_MOCK is explicitly set to 'true'
 * 2. APP_ENV is set to 'test' (server-side only check)
 *
 * This ensures MSW is only active in test environments and requires explicit opt-in,
 * preventing accidental activation in development or production.
 *
 * ## Why APP_ENV instead of NODE_ENV?
 *
 * Next.js automatically sets NODE_ENV to "production" after `next build`, regardless
 * of the actual deployment target. This behavior is hardcoded in Next.js and cannot
 * be overridden. As a result, NODE_ENV cannot distinguish between:
 *
 * - E2E testing environment (production build with mocks)
 * - Preview/staging deployments
 * - Actual production deployment
 *
 * APP_ENV solves this by providing a custom environment identifier that persists
 * through the build process, allowing us to:
 * - Enable MSW in production builds for E2E testing (APP_ENV=test)
 * - Keep MSW disabled in real production (APP_ENV=undefined or development)
 *
 * @returns {boolean} True if MSW should be enabled, false otherwise
 *
 * @example
 * // In a test environment with MSW enabled
 * process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'true'
 * process.env.APP_ENV = 'test'
 * isMSWEnabled() // returns true
 *
 * @example
 * // In development with MSW disabled
 * process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'false'
 * process.env.APP_ENV = 'development'
 * isMSWEnabled() // returns false
 */
export function isMSWEnabled(): boolean {
  // Client-side: only check NEXT_PUBLIC_ENABLE_MSW_MOCK
  // This simpler check prevents hydration mismatches between server and client
  // The client can't access server-only env vars like APP_ENV
  if (typeof window !== 'undefined') {
    return env.NEXT_PUBLIC_ENABLE_MSW_MOCK === 'true'
  }

  // Server-side: require both NEXT_PUBLIC_ENABLE_MSW_MOCK and test environment
  // This dual check ensures MSW doesn't accidentally run in production
  // Even if NEXT_PUBLIC_ENABLE_MSW_MOCK is set, it won't activate unless in test mode
  return (
    env.NEXT_PUBLIC_ENABLE_MSW_MOCK === 'true' &&
    (env.APP_ENV === 'test' || process.env.NODE_ENV === 'test')
  )
}
