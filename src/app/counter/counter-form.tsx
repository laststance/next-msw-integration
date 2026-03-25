'use client'

import { useActionState } from 'react'

import { incrementCounter } from './actions'
import { initialCounterState } from './types'

/**
 * Counter form component using useActionState with Server Actions
 *
 * @description
 * Handles the interactive counter logic using React 19's useActionState.
 * Separated as a Client Component so the parent page can remain a Server Component,
 * which ensures proper SSR/hydration of the action state.
 *
 * @example
 * <CounterForm />
 */
export function CounterForm() {
  const [state, formAction, pending] = useActionState(
    incrementCounter,
    initialCounterState,
  )

  return (
    <>
      <p className="text-6xl font-bold mb-8" data-testid="counter-value">
        {state.count}
      </p>

      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? 'Incrementing...' : 'Increment'}
        </button>
      </form>

      {state.error && (
        <p className="mt-4 text-red-500" role="alert">
          Error: {state.error}
        </p>
      )}
    </>
  )
}
