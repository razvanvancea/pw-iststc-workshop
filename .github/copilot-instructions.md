---
description: 'Playwright test generation and architecture guidelines for workshop and production tests'
applyTo: '**'
---

## Test Writing Guidelines

### Code Quality Standards
- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting. When extracting into page objects, prefer role-based locators over data-test attributes for business-critical UI elements.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes. Always await assertions to allow Playwright's retry mechanisms to work.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts. Use `expect().toBeVisible()` with timeout options only when testing explicit visibility changes.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions. For workshop-style tests with exercises, use JSDoc-style comments to explain the learning objective.


### Test Structure
- **Imports**: Start with `import { test, expect } from '../base';` (or '@playwright/test' for standalone tests). Use the project's base fixture file to access custom page objects and fixtures.
- **Organization**: Group related tests for a feature under a `test.describe()` block. Use descriptive suite names that reflect the feature or page being tested.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page). Avoid test interdependencies; each test should be independent and runnable in any order.
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`. For workshop exercises, prefix with exercise number (e.g., `ex 1: User can logout`).
- **Fixture Injection**: Inject page objects via Playwright fixtures (e.g., `async ({ page, loginPage }) => {...}`). Never instantiate page objects directly in tests—use the fixture system for consistency and reusability.


### File Organization
- **Test Location**: Store all test files in the `tests/` directory. For workshop-style tests with numbered exercises, use the naming convention `<number>-<topic>.spec.ts` (e.g., `02-account-creation.spec.ts`).
- **Page Objects Location**: Store page object classes in the `pages/` directory with the naming convention `<page-name>.page.ts` (e.g., `login.page.ts`, `header.page.ts`).
- **Scope**: Aim for one test file per major application feature or page. Keep page object classes focused and cohesive; group related interactions into logical methods.

### Page Object Model (POM)
- **Purpose**: Use page objects to encapsulate UI interaction logic and selectors, making tests readable and maintainable.
- **Structure**: Create a class for each major page or component. Initialize all locators in the constructor and expose them as readable properties.
- **Methods**: Create intuitive business-level methods (e.g., `login()`, `fillRegistrationForm()`) that hide selector complexity. Return `this` from action methods to enable fluent chaining.
- **Assertions**: Keep assertions in test files, not in page objects. Page objects should focus on actions and navigation, not validation.
- **Example**:
  ```typescript
  export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
      this.page = page;
      this.emailInput = page.locator('[data-test="email"]');
      this.passwordInput = page.locator('[data-test="password"]');
      this.loginButton = page.locator('[data-test="login-submit"]');
    }

    async login(email: string, password: string) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
  }
  ```

### Custom Fixtures
- **Purpose**: Use Playwright fixtures to inject page objects and custom utilities into tests, promoting reusability and consistency.
- **Setup**: Extend Playwright's `base` test object in a shared file (e.g., `base.ts`) and export as the main test object.
- **Injection**: Page objects and fixtures are automatically available to all test files that import the custom test object.
- **Example**: See `base.ts` for fixture definitions. Tests import with `import { test, expect } from '../base';`

### Assertion Best Practices
- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot. Useful for verifying complex UI hierarchies.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches. Always await these assertions to allow retry mechanisms.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action. Use regex for flexible URL matching when needed.
- **Visibility & State**: Use `toBeVisible()`, `toBeEnabled()`, `toBeChecked()` for state assertions. Avoid `toBeVisible()` in loops; use locator filters instead.

### Test Data Management
- **Random Data**: Use the `faker` library to generate unique data for each test run. For registration/account tests, always use unique email addresses via `faker.internet.email()`.
- **Static Test Data**: Define constant test credentials (e.g., admin/standard user accounts) in test files or a shared constants file. Document expected values clearly.
- **Data Cleanup**: For tests that create data, ensure cleanup in `afterEach` hooks if the application doesn't auto-cleanup. Keep tests isolated and independent.
- **Example**:
  ```typescript
  import { faker } from '@faker-js/faker';
  
  const randomEmail = faker.internet.email();
  const adminEmail = 'admin@practicesoftwaretesting.com';
  const adminPassword = 'welcome01';
  ```

### Debugging Strategies
- **Locate the Issue**: Run tests in headed mode with `npx playwright test --headed` to watch interactions in real-time.
- **Step-by-Step Inspection**: Use `await page.pause()` to pause test execution and inspect page state with the Playwright Inspector.
- **Locator Validation**: Use `page.locator(selector).isVisible()` or `count()` to verify that selectors are finding the expected elements.
- **Timing Issues**: Check if the application needs extra time to load. Verify with `await page.waitForLoadState('networkidle')` for initial page loads.
- **Accessibility Tree**: Print the accessibility snapshot with `console.log(await page.accessibility.snapshot())` to debug locator issues.
- **Screenshot on Failure**: The test report includes screenshots; review them to understand what the page looks like when assertions fail.
- **Verbose Logging**: Run tests with `--verbose` flag: `npx playwright test --verbose`


## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Movie Search Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('https://debs-obrien.github.io/playwright-movies-app');
  });

  test('Search for a movie by title', async ({ page }) => {
    await test.step('Activate and perform search', async () => {
      await page.getByRole('search').click();
      const searchInput = page.getByRole('textbox', { name: 'Search Input' });
      await searchInput.fill('Garfield');
      await searchInput.press('Enter');
    });

    await test.step('Verify search results', async () => {
      // Verify the accessibility tree of the search results
      await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - main:
          - heading "Garfield" [level=1]
          - heading "search results" [level=2]
          - list "movies":
            - listitem "movie":
              - link "poster of The Garfield Movie The Garfield Movie rating":
                - /url: /playwright-movies-app/movie?id=tt5779228&page=1
                - img "poster of The Garfield Movie"
                - heading "The Garfield Movie" [level=2]
      `);
    });
  });
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium` to run all tests.
2. **Run Specific Suite**: Use `npx playwright test <filename>` to run a single test file (e.g., `npx playwright test 01-playwright-fundamentals.spec.ts`).
3. **Run Specific Test**: Use `npx playwright test -g "test name pattern"` to run tests matching a pattern.
4. **Headed Mode**: Use `npx playwright test --headed` to see interactions in a browser window. Useful for debugging.
5. **Debug Failures**: See Debugging Strategies section above. Analyze test failures and identify root causes.
6. **Code Quality**: Before committing, run:
   - `npm run format` — auto-format code
   - `npm run lint` — check for linting issues
   - `npm run test` — run all tests
7. **Iterate**: Refine locators, assertions, or test logic as needed.
8. **Validate**: Ensure tests pass consistently and cover the intended functionality.
9. **Report**: Review test report in `playwright-report/` directory or CI logs.

## Quality Checklist

Before finalizing tests, ensure:
- [ ] All locators are accessible, specific, and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted with `npm run format`
- [ ] No linting errors with `npm run lint`
- [ ] All tests pass consistently with `npm run test`
- [ ] Page objects are used for complex UI interactions, not duplicated across tests
- [ ] Test data is randomized where appropriate (using faker for emails, etc.)
- [ ] Tests are independent and can run in any order
- [ ] Comments explain *why*, not *what* (e.g., "Wait for network idle after form submit" not "await page.waitForLoadState")
- [ ] Page objects use fluent chaining where appropriate for readability
