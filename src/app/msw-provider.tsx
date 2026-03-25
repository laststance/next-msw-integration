'use client'

import { useLayoutEffect, useState } from 'react'

import { isMSWEnabled } from '@/utils/isMSWEnabled'

/**
 * MSWProvider - Wrapper component to initialize Mock Service Worker
 *
 * @component
 * @description
 * This provider ensures MSW is properly initialized before rendering children.
 * It handles the async nature of MSW setup and provides a loading state.
 *
 * Implementation rationale:
 * - Uses 'use client' to ensure client-side execution (MSW requires browser APIs)
 * - useLayoutEffect instead of useEffect to initialize MSW before first paint
 * - Shows loading UI while MSW initializes to prevent race conditions
 *
 * Known issues addressed:
 * - Without proper initialization sequencing, components may fetch before MSW is ready
 * - React StrictMode double-rendering can cause multiple MSW initializations
 * - SSR incompatibility - MSW only works in browser environment
 *
 * @param {React.ReactNode} children - Child components that require MSW to be initialized
 */
export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  // Start as "ready" to match server-rendered HTML and avoid hydration mismatch.
  // Server always renders children (isMSWEnabled() returns false in non-test envs).
  // useLayoutEffect will set this to false before paint if MSW needs to initialize.
  const [isMSWReady, setIsMSWReady] = useState(true)

  useLayoutEffect(() => {
    if (!isMSWEnabled() || typeof window === 'undefined') {
      return
    }

    // Block rendering while MSW initializes — this fires before browser paint,
    // so the user never sees children flash before MSW is ready.
    setIsMSWReady(false)

    // Dynamically import MSW browser worker to avoid SSR bundle issues
    import('../../mocks/browser')
      .then(async ({ worker }) => {
        try {
          await worker.start({
            onUnhandledRequest: 'bypass', // Allow non-mocked requests to pass through
          })
        } catch {
          // If MSW fails to start, allow app to continue
        }
        setIsMSWReady(true)
      })
      .catch(() => {
        // Import failures shouldn't block the app
        setIsMSWReady(true)
      })
  }, [])

  // Show loading UI while MSW is initializing (only after useLayoutEffect fires)
  if (!isMSWReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Initializing MSW...</p>
      </div>
    )
  }

  // Once MSW is ready (or disabled/server-side), render children normally
  return <>{children}</>
}
