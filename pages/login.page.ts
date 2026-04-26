import { expect, type Locator, type Page } from '@playwright/test';
import { HeaderPage } from './header.page';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loggedInUsername: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    this.loggedInUsername = page.locator('[data-test="nav-menu"]');
  }

  async login(email: string, password: string, expectedUsername: string = 'John Doe') {
    const headerPage = new HeaderPage(this.page);
    await headerPage.signInButton.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.loggedInUsername).toContainText(expectedUsername);
  }
}

// await page.goto('https://practicesoftwaretesting.com/');
// await page.locator('[data-test="nav-sign-in"]').click();
// await page.locator('[data-test="email"]').click();
// await page.locator('[data-test="email"]').fill('admin@practicesoftwaretesting.com');
// await page.locator('[data-test="password"]').click();
// await page.locator('[data-test="password"]').fill('welcome01');
// await page.locator('[data-test="password"]').click();
// await page.locator('[data-test="login-submit"]').click();
// await expect(page.locator('[data-test="nav-menu"]')).toContainText('John Doe');
// await page.locator('div').nth(3).click();
