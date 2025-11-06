'use client'

import { useEffect, useState } from 'react'

export default function TestMSWClient() {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch user data: ${res.status} ${res.statusText}`,
          )
        }
        return res.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
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
        {user && (
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
        )}
      </div>
      <p className="text-sm text-gray-600 mt-4">
        If you see &quot;John Doe&quot; above, MSW is working! 🎉
      </p>
    </div>
  )
}
