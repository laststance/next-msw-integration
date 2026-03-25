import Link from 'next/link'

/**
 * Pokemon API response shape from https://pokeapi.co/api/v2/pokemon
 *
 * @example
 * { count: 1302, results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }] }
 */
type PokemonListResponse = {
  count: number
  results: { name: string; url: string }[]
}

/**
 * Extracts the Pokemon ID from a PokeAPI resource URL.
 *
 * @param url - PokeAPI URL like "https://pokeapi.co/api/v2/pokemon/25/"
 * @returns The numeric ID string, e.g. "25"
 *
 * @example
 * extractPokemonId('https://pokeapi.co/api/v2/pokemon/25/') // => '25'
 * extractPokemonId('https://pokeapi.co/api/v2/pokemon/1/')  // => '1'
 */
function extractPokemonId(url: string): string {
  const segments = url.replace(/\/$/, '').split('/')
  return segments[segments.length - 1]
}

/**
 * Pokemon demo page — Server Component fetching an external API mocked by MSW
 *
 * @description
 * Demonstrates the primary use case for server-side MSW integration:
 * intercepting external API calls made by Server Components.
 *
 * Architecture:
 * 1. This async Server Component calls fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
 * 2. MSW's Node.js server interceptor (set up in layout.tsx) catches the request
 * 3. The handler in mocks/handlers.ts returns mock Pokemon data
 * 4. The Server Component renders the data — no client-side JavaScript needed
 *
 * This contrasts with the homepage (client-side fetch + browser MSW worker)
 * and the counter demo (Server Action without external fetch).
 *
 * @example
 * // Accessible at /pokemon
 * // Requires MSW: NEXT_PUBLIC_ENABLE_MSW_MOCK=true, APP_ENV=test
 */
export default async function PokemonPage() {
  let data: PokemonListResponse | null = null
  let error: string | null = null

  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12', {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
    }

    data = await res.json()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Pokemon Demo</h1>
        <p className="text-red-500" role="alert">
          Error: {error}
        </p>
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Pokemon Demo</h1>
      <p className="text-gray-500" data-testid="pokemon-subtitle">
        Server Component + MSW Server-Side Interception (
        {data?.results.length ?? 0} Pokemon)
      </p>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl w-full"
        data-testid="pokemon-grid"
      >
        {data?.results.map((pokemon) => {
          const id = extractPokemonId(pokemon.url)
          return (
            <div
              key={pokemon.name}
              className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              data-testid="pokemon-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={pokemon.name}
                width={96}
                height={96}
                className="mx-auto"
              />
              <p className="mt-2 font-medium capitalize">{pokemon.name}</p>
              <p className="text-xs text-gray-400">#{id}</p>
            </div>
          )
        })}
      </div>

      <Link href="/" className="text-blue-500 hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  )
}
