import { test, expect } from '../base';

test.describe('Fundamentals test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  /**
   *Exercise 1: debug the test below and make it pass
   */
  test('ex 1: the user should be able to logout', async ({ loginPage, page }) => {
    await loginPage.login('admin@practicesoftwaretesting.com', 'welcome01');
    await page.locator('[data-test="nav-menu"]').click();
    await page.locator('[data-test="nav-sign-out"]').click();
    await expect(page.locator('[data-test="nav-sign-in"]')).toContainText('Sign in');
  });

  /**
   * Exercise 2: create a login test reusing POM implementation for standard user and verify that the username is correct after login
   * Hint: standard user credentials: customer@practicesoftwaretesting.com / welcome01
   * Hint 2: standard user name is Jane Doe
   */

  test('ex 2: the user should be able to login as standard user', async ({ loginPage }) => {
    await loginPage.login('customer@practicesoftwaretesting.com', 'welcome01', 'Jane Doe');
  });

  /**
   * Quality checkpoint:
   *
   * Before moving forward, run from CLI:
   * npm run format
   * npm run lint
   * npm run test
   */
});
