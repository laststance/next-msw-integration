import { test, expect } from '@playwright/test'

test.describe('MSW Integration Tests', () => {
  test('should intercept API requests and return mocked data', async ({
    page,
  }) => {
    // Navigate to the MSW test page
    await page.goto('/test-msw')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the mocked user data is displayed
    await expect(page.getByText('MSW Test Page')).toBeVisible()

    // Verify mocked data from /api/user is displayed
    await expect(page.getByText('Name: John Doe')).toBeVisible()
    await expect(page.getByText('john.doe@example.com')).toBeVisible()

    // Check for success message
    await expect(
      page.getByText('If you see "John Doe" above, MSW is working! 🎉'),
    ).toBeVisible()
  })

  test('should display user data correctly', async ({ page }) => {
    await page.goto('/test-msw')

    // Wait for the user data to be loaded
    await expect(page.getByText('User Data (from MSW)')).toBeVisible()

    // Verify all user fields are present
    await expect(page.getByText(/ID:.*1/)).toBeVisible()
    await expect(page.getByText(/Name:.*John Doe/)).toBeVisible()
    await expect(page.getByText(/Email:.*john.doe@example.com/)).toBeVisible()
  })
})
