'use server'

import type { CounterState } from './types'

/**
 * Server Action that increments a counter.
 *
 * In a real application, this would persist the count to a database.
 * Here it performs the increment logic directly on the server,
 * demonstrating Server Actions as a mutation pattern in a Next.js app
 * with MSW integration.
 *
 * @param prevState - The previous counter state from useActionState
 * @param _formData - Form data from the submit event (unused for this action)
 * @returns
 * - On success: `{ count: prevState.count + 1, error: null }`
 * - On failure: `{ count: prevState.count, error: "error message" }`
 *
 * @example
 * // Used with useActionState in a client component:
 * const [state, formAction, pending] = useActionState(incrementCounter, initialCounterState)
 * // state.count starts at 0, becomes 1 after first submit
 */
export async function incrementCounter(
  prevState: CounterState,
  _formData: FormData,
): Promise<CounterState> {
  try {
    // Simulate server-side processing (e.g., database write)
    // In production, this would call a database or external service
    const newCount = prevState.count + 1

    return { count: newCount, error: null }
  } catch (err) {
    return {
      count: prevState.count,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
