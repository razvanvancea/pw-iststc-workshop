import { type Locator, type Page } from '@playwright/test';

export class HeaderPage {
  readonly page: Page;
  readonly loginSection: Locator;
  readonly welcomeMessage: Locator;
  readonly signInButton: Locator;
  readonly userMenu: Locator;
  readonly signOutButton: Locator;
  readonly userMenuText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginSection = page.locator('#loginSection');
    this.welcomeMessage = page.locator('text=Welcome back');
    this.signInButton = page.locator('[data-test="nav-sign-in"]');
    this.userMenu = page.locator('[data-test="nav-menu"]');
    this.signOutButton = page.locator('[data-test="nav-sign-out"]');
    this.userMenuText = page.locator('[data-test="nav-menu"]');
  }

  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async clickSignOut(): Promise<void> {
    await this.signOutButton.click();
  }

  async logout(): Promise<void> {
    await this.clickUserMenu();
    await this.clickSignOut();
  }

  async verifyWelcomeMessage(): Promise<void> {
    await this.loginSection.isVisible();
  }

  async verifyUserLoggedIn(username: string): Promise<void> {
    await this.userMenuText.isVisible();
  }
}
