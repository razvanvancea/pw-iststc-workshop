import { type Locator, type Page } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;
  readonly registerLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly streetInput: Locator;
  readonly houseNumberInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerLink = page.locator('[data-test="register-link"]');
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dobInput = page.locator('[data-test="dob"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerButton = page.locator('[data-test="register-submit"]');
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }

  async fillFirstName(firstName: string): Promise<this> {
    await this.firstNameInput.fill(firstName);
    return this;
  }

  async fillLastName(lastName: string): Promise<this> {
    await this.lastNameInput.fill(lastName);
    return this;
  }

  async fillDateOfBirth(dob: string): Promise<this> {
    await this.dobInput.fill(dob);
    return this;
  }

  async fillStreet(street: string): Promise<this> {
    await this.streetInput.fill(street);
    return this;
  }

  async fillHouseNumber(houseNumber: string): Promise<this> {
    await this.houseNumberInput.fill(houseNumber);
    return this;
  }

  async fillCity(city: string): Promise<this> {
    await this.cityInput.fill(city);
    return this;
  }

  async fillState(state: string): Promise<this> {
    await this.stateInput.fill(state);
    return this;
  }

  async fillPostalCode(postalCode: string): Promise<this> {
    await this.postalCodeInput.fill(postalCode);
    return this;
  }

  async selectCountry(countryCode: string): Promise<this> {
    await this.countrySelect.selectOption(countryCode);
    return this;
  }

  async fillPhone(phone: string): Promise<this> {
    await this.phoneInput.fill(phone);
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.emailInput.fill(email);
    return this;
  }

  async fillPassword(password: string): Promise<this> {
    await this.passwordInput.fill(password);
    return this;
  }

  async submitRegistration(): Promise<void> {
    await this.registerButton.click();
  }

  async registerNewUser(
    firstName: string,
    lastName: string,
    dob: string,
    street: string,
    houseNumber: string,
    city: string,
    state: string,
    postalCode: string,
    countryCode: string,
    phone: string,
    email: string,
    password: string
  ): Promise<void> {
    await this.clickRegisterLink();
    await this.fillFirstName(firstName)
      .then(() => this.fillLastName(lastName))
      .then(() => this.fillDateOfBirth(dob))
      .then(() => this.fillStreet(street))
      .then(() => this.fillHouseNumber(houseNumber))
      .then(() => this.fillCity(city))
      .then(() => this.fillState(state))
      .then(() => this.fillPostalCode(postalCode))
      .then(() => this.selectCountry(countryCode))
      .then(() => this.fillPhone(phone))
      .then(() => this.fillEmail(email))
      .then(() => this.fillPassword(password))
      .then(() => this.submitRegistration());
  }
}
