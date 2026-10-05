# Copilot Plan

## Current State

- Playwright project with TypeScript and Playwright Test.
- Test projects: Chromium, Firefox, and WebKit.
- Default environment: `qa1`, selected through `TEST_ENV`.
- Root-level configuration only: environment connections, role/user definitions, and reporters are stored beside the project config in the workspace root.
- Current root-level files:
  - `playwright.config.ts`
  - `pie-chart-reporter.ts`
  - `carepro-sql-data-retrievers.ts`
- Environment account credentials and role users are sourced from environment variables in `playwright.config.ts`.
- Shared SQL access, query templates, and placeholder substitution live in the root-level `carepro-sql-data-retrievers.ts`.
- Six CarePro Playwright spec files cover login validation, About Evolent, Download CSV, the Provider Portal Message section, NCCN Guidelines, and Useful Documents.
- All current scenarios use the `@NoTouch` tag; Chromium discovery lists 22 scenarios.
- Useful Documents scenarios select a network for Office Manager, Provider, and PCP Provider users, then verify the Clinical Data Elements download.
- GitHub Actions runs the full suite on pushes and pull requests to `main` or `master`. Manual dispatch accepts an environment (default `qa1`) and tag (default `@NoTouch`); tagged manual runs use Chromium.
- Current CarePro specs:
  - `tests/Carepro/Common/login-validations.spec.ts`
  - `tests/Carepro/ProviderPortal/HomePage/PP_HP_AboutEvolent.spec.ts`
  - `tests/Carepro/ProviderPortal/HomePage/PP_HP_DownloadCSV.spec.ts`
  - `tests/Carepro/ProviderPortal/HomePage/PP_HP_MessageSection.spec.ts`
  - `tests/Carepro/ProviderPortal/UsefulTools/PP_UT_NCCNGuidelines.spec.ts`
  - `tests/Carepro/ProviderPortal/UsefulTools/PP_UT_UsefulDocuments.spec.ts`
- Clinical Reviewer login validation expects the `Notification` tab to be hidden.
- About Evolent assertions use link-role locators to handle duplicate navigation/footer links.
- `npx tsc --noEmit` passes.
- Verified run evidence:
  - The targeted Intake Coordinator login validation executed successfully: `1 passed (12.0s)`.
  - Other role-based runs are intentionally skipped until their QA credentials are configured in the environment.

## Recommended Next Steps

1. Configure any remaining role-specific QA credentials for FLR / CLR / Pharmacy / Office Manager / Provider / PCP Provider in GitHub or local environment variables before running the full matrix.
2. Run the full `@NoTouch` Chromium suite against `qa1` once the environment is complete to confirm the broader coverage set remains green.
3. Expand validation to Firefox and WebKit where the application behavior is stable enough to compare.
4. Add focused SQL retriever tests for query selection, placeholder substitution, and missing database configuration.
5. Consider a reusable authenticated page fixture to reduce repeated login helpers across specs.

## Validation Commands

```powershell
npx tsc --noEmit
$env:TEST_ENV = "qa1"
npx playwright test tests/Carepro/Common/login-validations.spec.ts --project=chromium --reporter=line --grep "Intake Coordinator user"
npx playwright test --project=chromium --grep "@NoTouch"
npx playwright test tests/Carepro/ProviderPortal/UsefulTools/PP_UT_UsefulDocuments.spec.ts --project=chromium
npx playwright test
```

Verified current result:

```powershell
npx playwright test tests/Carepro/Common/login-validations.spec.ts --project=chromium --reporter=line --grep "Intake Coordinator user"
# Result: 1 passed (12.0s)
```

## Environment Selection

Use `TEST_ENV` to select the environment. When it is not set, tests use `qa1`.

```powershell
$env:TEST_ENV = "shdev"
npx playwright test
```
