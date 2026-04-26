import { test, expect } from '../base';
import { faker } from '@faker-js/faker';

test.describe('Account creation codegen test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Exercise 3A: use the codegen feature and record the test for creating an account
   * Exercise 3B: refactor the test by removing unnecessary steps and add assertions to verify that the account was created successfully
   * Exercise 3C: use faker library to generate random unique email address for each test run
   * 3C Note: feel free to use the randomEmail constant to fill the email address. It creates a random email address using the faker library and can be used to ensure that each test run uses a unique email address
   */
  test('ex 3: the user should be able to create a new account', async ({ page }) => {
    const randomEmail = faker.internet.email();

    await page.locator('[data-test="nav-sign-in"]').click();
    await page.locator('[data-test="register-link"]').click();
    await page.locator('[data-test="first-name"]').fill('John');
    await page.locator('[data-test="last-name"]').fill('Sparrow');
    await page.locator('[data-test="dob"]').fill('1990-02-20');
    await page
      .locator('div')
      .filter({ hasText: /^Street$/ })
      .click();
    await page.locator('[data-test="street"]').click();
    await page.locator('[data-test="street"]').fill('Baker');
    await page.locator('[data-test="postal_code"]').fill('232222');
    await page.locator('[data-test="house_number"]').fill('11');
    await page.locator('[data-test="city"]').fill('London');
    await page.locator('[data-test="state"]').fill('UK');
    await page.locator('[data-test="country"]').selectOption('AM');
    await page.locator('[data-test="phone"]').fill('0722222222');

    // use the randomEmail constant to fill the email address
    await page.locator('[data-test="email"]').fill(randomEmail);

    await page.locator('[data-test="password"]').fill('Qweqwe.123asd');
    await page.locator('[data-test="register-submit"]').click();
    await expect(page.getByRole('heading')).toContainText('Login');
  });
});
