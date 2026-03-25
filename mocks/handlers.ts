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

  /**
   * Mock PokeAPI list endpoint (external API)
   * Demonstrates server-side MSW interception for Server Components.
   * The absolute URL is key — MSW's Node.js interceptor catches this
   * when the Server Component calls fetch() on the server.
   *
   * @example
   * // Matches: GET https://pokeapi.co/api/v2/pokemon?limit=12
   * // Returns: { count, results: [{ name, url }] }
   */
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? '12')

    const allPokemon = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon/133/' },
      { name: 'snorlax', url: 'https://pokeapi.co/api/v2/pokemon/143/' },
      { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/' },
      { name: 'chikorita', url: 'https://pokeapi.co/api/v2/pokemon/152/' },
      { name: 'totodile', url: 'https://pokeapi.co/api/v2/pokemon/158/' },
      { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon/172/' },
      { name: 'togepi', url: 'https://pokeapi.co/api/v2/pokemon/175/' },
      { name: 'mareep', url: 'https://pokeapi.co/api/v2/pokemon/179/' },
    ]

    return HttpResponse.json({
      count: allPokemon.length,
      results: allPokemon.slice(0, limit),
    })
  }),
]
