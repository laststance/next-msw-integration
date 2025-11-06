import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

/**
 * Browser-side MSW worker
 * This will intercept requests in the browser using a Service Worker
 */
export const worker = setupWorker(...handlers)
