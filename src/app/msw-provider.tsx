'use client'

import { useLayoutEffect, useState } from 'react'

import { isMSWEnabled } from '@/utils/isMSWEnabled'

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  // Start with false when MSW is enabled (needs to wait), true when disabled (ready immediately)
  const [isMSWReady, setIsMSWReady] = useState(!isMSWEnabled())

  useLayoutEffect(() => {
    // If MSW is not enabled, we're already ready
    if (!isMSWEnabled()) {
      setIsMSWReady(true)
      return
    }

    // If not in browser, we're ready (SSR)
    if (typeof window === 'undefined') {
      setIsMSWReady(true)
      return
    }

    // Start MSW worker in browser and wait for it
    import('../../mocks/browser')
      .then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest: 'bypass',
        })
        setIsMSWReady(true)
      })
      .catch((error) => {
        console.error('Failed to start MSW worker:', error)
        setIsMSWReady(true) // Continue rendering even if MSW fails
      })
  }, [])

  // Block rendering only when MSW is enabled and not ready yet
  if (!isMSWReady) {
    return null
  }

  return children
}
