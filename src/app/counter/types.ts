/**
 * State shape for the counter Server Action
 *
 * @example
 * const state: CounterState = { count: 0, error: null }
 */
export type CounterState = {
  count: number
  error: string | null
}

/** Initial state for the counter */
export const initialCounterState: CounterState = { count: 0, error: null }
