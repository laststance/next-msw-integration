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
  if (typeof window !== 'undefined') {
    return env.NEXT_PUBLIC_ENABLE_MSW_MOCK === 'true'
  }

  // Server-side: check both variables
  return (
    env.NEXT_PUBLIC_ENABLE_MSW_MOCK === 'true' &&
    (env.APP_ENV === 'test' || process.env.NODE_ENV === 'test')
  )
}
