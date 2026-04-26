---
description: 'Playwright test generation instructions'
applyTo: '**'
---

## Project Overview

Playwright + TypeScript E2E test framework targeting **https://practicesoftwaretesting.com** (e-commerce app). Tests run against **Google Chrome** only (the sole active project in `playwright.config.ts`).

## Architecture & Key Files

- `tests/` — Test files, named `<feature>.spec.ts` (one file per feature/page)
- `pages/` — Page Object Model classes, named `<feature>.page.ts` (see `pages/login.page.ts`)
- `playwright.config.ts` — Custom `testIdAttribute: 'data-test'` (not the default `data-testid`), 60s test timeout, 15s expect timeout
- Base URL is configurable: `BASE_URL` env var, defaults to `https://practicesoftwaretesting.com`
- CI behavior: 2 retries, 1 worker, `forbidOnly`; locally: 0 retries, unlimited workers
- Artifacts: traces retained on failure, screenshots only on failure, video off

### Page Object Pattern

Page objects export a class taking `Page` in constructor, expose locators as `readonly` properties, and encapsulate workflows as `async` methods. Use `type` imports for Playwright types:

```typescript
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
  }
  async login(email: string, password: string) { /* ... */ }
}
```

Instantiate in tests: `const loginPage = new LoginPage(page);`

## Test Writing Rules

### Locators (Priority Order)
1. Role-based: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`
2. Test ID: `getByTestId('myId')` — resolves to `[test-data="myId"]` due to custom config

### Assertions
- Use auto-retrying web-first assertions (`await expect(locator).toHaveText()`, `toContainText`, `toHaveURL`, `toHaveCount`, `toMatchAriaSnapshot`)
- Avoid `toBeVisible()` unless specifically testing visibility changes
- Rely on Playwright's auto-waiting; never add hard-coded waits

### Structure
- `import { test, expect } from '@playwright/test';`
- Group related tests under `test.describe()`
- Use `beforeEach` for common setup (e.g., `page.goto('/')`)
- Tag smoke tests with `@smoke` in the test title (run via `npm run test:smoke`)

### ESLint Enforcement
The project enforces `@typescript-eslint/no-floating-promises` and `@typescript-eslint/await-thenable`. Every Playwright call returning a Promise **must** be awaited. Unhandled promises will fail linting (`npm run lint`).

## Developer Commands

| Command | Purpose |
|---|---|
| `npm run test:headless` | Run all tests headless, single worker |
| `npm run test:headed` | Run all tests with browser visible |
| `npm run test:debug` | Run headed with Playwright Inspector |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:smoke` | Run only `@smoke`-tagged tests |
| `npm run show:report` | Open HTML report |
| `npm run codegen` | Launch Playwright codegen against target site |
| `npm run lint` | TypeScript type-check + ESLint |
| `npm run format` | Prettier formatting |

## Available Libraries

- `@faker-js/faker` — Use for generating dynamic test data (names, emails, etc.) instead of hardcoding values
- `@playwright/test` — Core test framework

## Quality Checklist

Before finalizing tests, ensure:
- [ ] All locators use accessible, role-based selectors; `getByTestId` maps to `data-test` attribute
- [ ] Every async Playwright call is `await`-ed (ESLint will catch violations)
- [ ] Reusable interactions are extracted into page objects in `pages/`
- [ ] Tests are grouped with `test.describe()`
- [ ] Smoke-critical tests include `@smoke` in the title