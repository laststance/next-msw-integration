import { expect, test } from '@playwright/test'

/**
 * E2E Tests for Top Page with MSW Integration
 *
 * @description
 * These tests verify that MSW (Mock Service Worker) correctly intercepts
 * API requests and returns mocked data on the home page.
 *
 * Test environment:
 * - MSW is enabled via NEXT_PUBLIC_ENABLE_MSW_MOCK=true
 * - APP_ENV is set to 'test' in playwright.config.ts
 * - The production build runs on http://localhost:3000
 *
 * What we're testing:
 * - MSW initialization completes successfully
 * - Mocked user data from /api/user endpoint is displayed
 * - No errors occur during the data fetching process
 * - The page renders the expected UI elements
 */

test.describe('Top Page with MSW', () => {
  /**
   * Test: Verify MSW mocked data displays correctly
   *
   * This test ensures that when the home page loads:
   * 1. MSW intercepts the /api/user request
   * 2. The mocked data (John Doe) is returned
   * 3. The UI correctly displays all user fields
   */
  test('should display mocked user data from MSW', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Wait for and verify the main heading appears
    // This indicates MSW has initialized and the page has rendered
    await expect(
      page.getByRole('heading', { name: 'MSW Test Page', level: 1 }),
    ).toBeVisible()

    // Verify the section heading for user data
    await expect(
      page.getByRole('heading', { name: 'User Data (from MSW)', level: 2 }),
    ).toBeVisible()

    // Verify all mocked user data fields are visible
    // These values come from mocks/handlers.ts
    // Using text patterns that match the full paragraph content
    await expect(page.getByText('ID: 1')).toBeVisible()
    await expect(page.getByText('Name: John Doe')).toBeVisible()
    await expect(page.getByText('Email: john.doe@example.com')).toBeVisible()
  })

  /**
   * Test: Verify API request was intercepted by MSW
   *
   * This test monitors network requests to ensure:
   * 1. The /api/user endpoint is called
   * 2. MSW returns a 200 OK response
   * 3. The response contains the expected mocked data
   */
  test('should intercept /api/user request with MSW', async ({ page }) => {
    // Set up request listener before navigation
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/user') && response.status() === 200,
    )

    // Navigate to home page
    await page.goto('/')

    // Wait for and verify the API response
    const response = await responsePromise

    // Verify response status
    expect(response.status()).toBe(200)

    // Verify response contains mocked data
    const responseData = await response.json()
    expect(responseData).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
  })

  /**
   * Test: Verify no error state appears
   *
   * This test ensures that:
   * 1. No error messages are displayed
   * 2. The loading state transitions properly to data display
   * 3. The page reaches a stable state with user data
   */
  test('should not display error state', async ({ page }) => {
    await page.goto('/')

    // Verify the main heading appears (success state)
    await expect(
      page.getByRole('heading', { name: 'MSW Test Page', level: 1 }),
    ).toBeVisible()

    // Verify no error text is visible
    // The error state would show "Error:" prefix
    await expect(page.getByText(/^Error:/)).not.toBeVisible()

    // Verify user data is visible (not in loading or error state)
    await expect(page.getByText(/^Name:/)).toBeVisible()
  })

  /**
   * Test: Verify initial loading state
   *
   * This test checks that:
   * 1. A loading state appears initially (or transitions too quickly to catch)
   * 2. The loading state is eventually replaced with actual data
   * 3. The page reaches a stable state with content
   */
  test('should transition from loading to data display', async ({ page }) => {
    await page.goto('/')

    // The loading might be too fast to catch, but we verify the final state
    // Eventually, the page should show the data (not stuck on loading)
    await expect(
      page.getByRole('heading', { name: 'MSW Test Page', level: 1 }),
    ).toBeVisible({ timeout: 10000 })

    // Verify we're not stuck on a loading screen
    // If MSW fails, we might see "Initializing MSW..." or "Loading..."
    await expect(page.getByText('Initializing MSW...')).not.toBeVisible()
    await expect(
      page.locator('text=Loading...').and(page.locator('p')),
    ).not.toBeVisible()
  })
})
