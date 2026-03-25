import { expect, test } from '@playwright/test'

/**
 * E2E Tests for Counter Page with Server Actions + MSW
 *
 * @description
 * These tests verify that MSW correctly intercepts fetch() calls made
 * within a Server Action. The counter page uses:
 * - React 19's useActionState for form-based state management
 * - A Server Action that calls https://api.example.com/counter
 * - MSW server-side handler that mocks the external API response
 *
 * Test environment:
 * - MSW is enabled via NEXT_PUBLIC_ENABLE_MSW_MOCK=true
 * - APP_ENV is set to 'test' in playwright.config.ts
 * - The production build runs on http://localhost:3000
 */

test.describe('Counter Page with MSW Server Actions', () => {
  /**
   * Test: Verify counter page renders with initial state
   *
   * Ensures the page loads with:
   * 1. The correct heading
   * 2. Counter starts at 0
   * 3. Increment button is visible and enabled
   */
  test('should display counter page with initial count of 0', async ({
    page,
  }) => {
    await page.goto('/counter')

    await expect(
      page.getByRole('heading', { name: 'Counter Demo', level: 1 }),
    ).toBeVisible()

    await expect(
      page.getByRole('heading', {
        name: 'Server Action Counter (MSW Mocked)',
        level: 2,
      }),
    ).toBeVisible()

    await expect(page.getByTestId('counter-value')).toHaveText('0')

    const button = page.getByRole('button', { name: 'Increment' })
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
  })

  /**
   * Test: Verify counter increments via Server Action + MSW
   *
   * This is the core test proving the full flow:
   * 1. Click "Increment" triggers form submit
   * 2. useActionState calls incrementCounter Server Action
   * 3. Server Action fetches https://api.example.com/counter
   * 4. MSW server-side handler intercepts and returns { count: current + 1 }
   * 5. UI updates with new count
   */
  test('should increment counter when button is clicked', async ({ page }) => {
    await page.goto('/counter')

    // Verify initial state
    await expect(page.getByTestId('counter-value')).toHaveText('0')

    // First increment: 0 → 1
    await page.getByRole('button', { name: 'Increment' }).click()
    await expect(page.getByTestId('counter-value')).toHaveText('1', {
      timeout: 10000,
    })

    // Second increment: 1 → 2
    await page.getByRole('button', { name: 'Increment' }).click()
    await expect(page.getByTestId('counter-value')).toHaveText('2', {
      timeout: 10000,
    })
  })

  /**
   * Test: Verify no error state in normal operation
   *
   * Ensures that after a successful increment:
   * 1. No error messages are displayed
   * 2. The counter shows a valid number
   */
  test('should not display error state after increment', async ({ page }) => {
    await page.goto('/counter')

    await page.getByRole('button', { name: 'Increment' }).click()
    await expect(page.getByTestId('counter-value')).toHaveText('1', {
      timeout: 10000,
    })

    // Verify no error message is visible
    await expect(page.getByText(/^Error:/)).not.toBeVisible()
  })
})
