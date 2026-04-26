import { test, expect } from '../base';

test.describe('Setup check: User authentication test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('the user should be able to login as admin', async ({ loginPage, headerPage }) => {
    await headerPage.clickSignIn();
    await loginPage.login('admin@practicesoftwaretesting.com', 'welcome01');
    await expect(headerPage.userMenuText).toContainText('John Doe');
  });
});
