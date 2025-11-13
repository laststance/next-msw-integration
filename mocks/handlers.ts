import { http, HttpResponse } from 'msw'

/**
 * Request handlers for Mock Service Worker (MSW)
 *
 * @description
 * Centralized definition of all MSW request handlers used for mocking API responses.
 * These handlers are shared between browser and server MSW instances.
 *
 * Implementation notes:
 * - Handlers are executed in the order they are defined
 * - More specific patterns should be placed before generic ones
 * - Use HttpResponse.json() for JSON responses (sets proper Content-Type)
 * - Handlers can be async for simulating delays or complex logic
 *
 * Known issues addressed:
 * - Without proper Content-Type headers, some fetch implementations may fail to parse JSON
 * - MSW v2 requires using HttpResponse instead of the older res() pattern
 */
export const handlers = [
  /**
   * Mock user profile endpoint
   * Returns static user data for testing authentication flows
   */
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
  }),

  /**
   * Mock login endpoint
   * Demonstrates async handler with request body parsing
   * Returns the submitted data along with a mock JWT token
   */
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      token: 'mock-jwt-token',
      user: body,
    })
  }),

  // Add more handlers as needed
  // Remember: Order matters - more specific routes should come first
]
