'use client'

import { useEffect, useState } from 'react'

/**
 * Main page component that displays MSW mocked user data
 *
 * @component
 * @description
 * This component demonstrates fetching and displaying data from MSW mocked API endpoints.
 *
 * Implementation rationale:
 * - Uses 'use client' directive to ensure client-side rendering, preventing SSR/hydration mismatches
 * - Implements proper cleanup with isMounted flag to prevent state updates after component unmount
 * - This pattern addresses React StrictMode double-rendering issues where effects run twice
 *
 * Known issues addressed:
 * - React StrictMode causes useEffect to run twice in development
 * - Without proper cleanup, this leads to race conditions and duplicate renders
 * - The isMounted pattern prevents "Can't perform a React state update on an unmounted component" warnings
 */
export default function Page() {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Flag to track if component is still mounted
    // This prevents state updates after component unmount, which is crucial in React StrictMode
    let isMounted = true

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user')
        if (!res.ok) {
          throw new Error(
            `Failed to fetch user data: ${res.status} ${res.statusText}`,
          )
        }
        const data = await res.json()

        // Only update state if component is still mounted
        // This prevents memory leaks and React warnings in StrictMode
        if (isMounted) {
          setUser(data)
        }
      } catch (err) {
        // Only set error state if component is still mounted
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        // Ensure loading state is updated only for mounted component
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    // Cleanup function: Mark component as unmounted
    // This is essential for preventing state updates after unmount in StrictMode
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">MSW Test Page</h1>
      <div className="border rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">User Data (from MSW)</h2>
        {user ? (
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No user data available</p>
        )}
      </div>
    </div>
  )
}
