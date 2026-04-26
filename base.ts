import { test as base, type Page } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { HeaderPage } from './pages/header.page';
import { RegistrationPage } from './pages/registration.page';

interface PageFixtures {
  loginPage: LoginPage;
  headerPage: HeaderPage;
  registrationPage: RegistrationPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }: { page: Page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  headerPage: async ({ page }: { page: Page }, use) => {
    const headerPage = new HeaderPage(page);
    await use(headerPage);
  },

  registrationPage: async ({ page }: { page: Page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },
});

export { expect } from '@playwright/test';
