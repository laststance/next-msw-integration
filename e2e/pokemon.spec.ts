import { expect, test } from '@playwright/test'

/**
 * E2E Tests for Pokemon Page — Server Component + MSW Server-Side Interception
 *
 * @description
 * These tests verify that MSW correctly intercepts fetch() calls made
 * by an async Server Component. The Pokemon page:
 * - Is a Server Component (no 'use client') that fetches at render time
 * - Calls https://pokeapi.co/api/v2/pokemon?limit=12
 * - MSW's Node.js server interceptor returns mock Pokemon data
 * - Renders a grid of Pokemon cards entirely on the server
 *
 * This demonstrates the primary MSW + Next.js integration pattern:
 * mocking external API dependencies in Server Components.
 *
 * Test environment:
 * - MSW is enabled via NEXT_PUBLIC_ENABLE_MSW_MOCK=true
 * - APP_ENV is set to 'test' in playwright.config.ts
 * - The production build runs on http://localhost:3000
 */

test.describe('Pokemon Page with MSW Server-Side Interception', () => {
  /**
   * Test: Verify Pokemon page renders with mocked data
   *
   * Ensures the page loads with:
   * 1. The correct heading
   * 2. Pokemon cards are visible
   * 3. Known Pokemon names from the mock handler appear
   */
  test('should display mocked Pokemon data from MSW', async ({ page }) => {
    await page.goto('/pokemon')

    await expect(
      page.getByRole('heading', { name: 'Pokemon Demo', level: 1 }),
    ).toBeVisible()

    await expect(page.getByTestId('pokemon-subtitle')).toContainText(
      '12 Pokemon',
    )

    await expect(page.getByTestId('pokemon-grid')).toBeVisible()

    // Verify well-known Pokemon from mock data
    await expect(page.getByText('bulbasaur')).toBeVisible()
    await expect(page.getByText('pikachu')).toBeVisible()
    await expect(page.getByText('mewtwo')).toBeVisible()
  })

  /**
   * Test: Verify correct number of Pokemon cards
   *
   * The mock handler returns 12 Pokemon.
   * Each card has data-testid="pokemon-card".
   */
  test('should render 12 Pokemon cards', async ({ page }) => {
    await page.goto('/pokemon')

    const cards = page.getByTestId('pokemon-card')
    await expect(cards).toHaveCount(12)
  })

  /**
   * Test: Verify no error state in normal operation
   *
   * Ensures that when MSW is active:
   * 1. No error messages are displayed
   * 2. The grid renders successfully
   */
  test('should not display error state', async ({ page }) => {
    await page.goto('/pokemon')

    await expect(page.getByText(/^Error:/)).not.toBeVisible()
    await expect(page.getByTestId('pokemon-grid')).toBeVisible()
  })
})
