import { http, HttpResponse } from 'msw'

/**
 * Request handlers for Mock Service Worker (MSW)
 * Define your API mocks here
 */
export const handlers = [
  // Example: Mock a GET request to /api/user
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
  }),

  // Example: Mock a POST request to /api/login
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      token: 'mock-jwt-token',
      user: body,
    })
  }),

  // Add more handlers as needed
]
