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
  // Track MSW initialization state
  // This prevents children from rendering before MSW intercepts are ready
  const [isMSWReady, setIsMSWReady] = useState(false)

  useLayoutEffect(() => {
    const enabled = isMSWEnabled()

    // Skip MSW initialization if disabled or in SSR context
    // This prevents errors during server-side rendering
    if (!enabled || typeof window === 'undefined') {
      setIsMSWReady(true)
      return
    }

    // Dynamically import MSW browser worker to avoid SSR bundle issues
    // MSW uses browser-only APIs that would fail during SSR
    import('../../mocks/browser')
      .then(async ({ worker }) => {
        try {
          await worker.start({
            onUnhandledRequest: 'bypass', // Allow non-mocked requests to pass through
          })
          setIsMSWReady(true)
        } catch {
          // If MSW fails to start, allow app to continue
          // This prevents the entire app from breaking due to MSW issues
          setIsMSWReady(true)
        }
      })
      .catch(() => {
        // Import failures shouldn't block the app
        setIsMSWReady(true)
      })
  }, [])

  // Show loading UI while MSW is initializing
  // This is the key fix for the persistent "Loading..." issue:
  // Without this check, child components may start fetching before MSW is ready,
  // causing requests to bypass MSW and potentially fail or return unexpected data
  if (isMSWEnabled() && !isMSWReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Initializing MSW...</p>
      </div>
    )
  }

  // Once MSW is ready (or disabled), render children normally
  return <>{children}</>
}
