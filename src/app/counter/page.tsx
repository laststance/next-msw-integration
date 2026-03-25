import Link from 'next/link'

import { CounterForm } from './counter-form'

/**
 * Counter demo page showcasing Server Actions mocked by MSW
 *
 * @description
 * Demonstrates the pattern where a Server Action calls an external API,
 * and MSW intercepts that fetch on the server side. The page is a Server
 * Component that renders the interactive CounterForm Client Component.
 *
 * Architecture:
 * 1. User clicks "Increment" button (form submit)
 * 2. useActionState calls incrementCounter Server Action
 * 3. Server Action fetches https://api.example.com/counter (intercepted by MSW)
 * 4. MSW returns { count: current + 1 }
 * 5. useActionState updates the UI with the new count
 *
 * @example
 * // This page is accessible at /counter
 * // Requires MSW to be enabled (NEXT_PUBLIC_ENABLE_MSW_MOCK=true, APP_ENV=test)
 */
export default function CounterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Counter Demo</h1>

      <div className="border rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-6">
          Server Action Counter (MSW Mocked)
        </h2>
        <CounterForm />
      </div>

      <Link href="/" className="text-blue-500 hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  )
}
