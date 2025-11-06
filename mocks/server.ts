import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/**
 * Server-side MSW server
 * This will intercept requests on the server (Node.js) side
 * Used for SSR, API routes, and production builds in test environments
 */
export const server = setupServer(...handlers)
