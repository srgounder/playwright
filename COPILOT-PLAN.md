# Copilot Plan

## Current State

- Playwright project with TypeScript and Playwright Test.
- Test projects: Chromium, Firefox, and WebKit.
- Default environment: `shqa`, selected through `TEST_ENV`.
- Environment connection settings: `config/carepro-environments-connectionstrings.ts`.
- Environment account credentials and role users: `config/carepro-environments-account-credentials.ts`.
- Shared SQL access, query templates, and placeholder substitution: `config/carepro-sql-data-retrievers.ts`.
- Current CarePro tests:
  - `tests/Carepro/Common/login-validations.spec.ts`
  - `tests/Carepro/ProviderPortal/HomePage/PPAboutEvolent.spec.ts`
- Clinical Reviewer login validation expects the `Notification` tab to be hidden.
- About Evolent assertions use link-role locators to handle duplicate navigation/footer links.
- TypeScript validation passes with `npx tsc --noEmit`.
- Focused Chromium validations pass for the Clinical Reviewer login and Office Manager About Evolent flows.

## Recommended Next Steps

1. Run the provider portal smoke spec against `shqa` with configured credentials.
2. Validate the About Evolent flow in Chromium first, then expand to Firefox and WebKit if supported by the application.
3. Replace hard-coded credential values with secret or environment-based configuration before sharing or running in CI.
4. Add a reusable authenticated page fixture to avoid repeating login logic across provider portal specs.
5. Add focused SQL retriever tests for query selection, placeholder substitution, and missing database configuration.
6. Add CI scripts for typecheck, targeted Playwright smoke tests, and HTML report publication.
7. Review the SQL query catalog for exact source-query parity and parameterize database values where practical.

## Validation Commands

```powershell
npx tsc --noEmit
$env:TEST_ENV = "shqa"
npx playwright test tests/Carepro/ProviderPortal/HomePage/PPAboutEvolent.spec.ts --project=chromium
npx playwright test tests/Carepro/Common/login-validations.spec.ts --grep "Clinical Reviewer user" --project=chromium
npx playwright test
```

## Environment Selection

Use `TEST_ENV` to select the environment. When it is not set, tests use `shqa`.

```powershell
$env:TEST_ENV = "shdev"
npx playwright test
```
