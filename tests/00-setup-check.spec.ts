import { test, expect } from '../base';

test.describe('Setup check: User authentication test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('the user should be able to login as admin', async ({ loginPage }) => {
    await loginPage.login('admin@practicesoftwaretesting.com', 'welcome01');
  });
});
