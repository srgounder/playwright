# Copilot Plan

## Current State

- Playwright project with TypeScript and Playwright Test.
- Test projects: Chromium, Firefox, and WebKit.
- Default environment: `qa1`, selected through `TEST_ENV`.
- Environment connection settings: moved into the root `playwright.config.ts`.
- Environment account credentials and role users: `config/carepro-environments-account-credentials.ts`.
- Shared SQL access, query templates, and placeholder substitution: `config/carepro-sql-data-retrievers.ts`.
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
- The previous 19-scenario Chromium `@NoTouch` suite passed; the three Useful Documents scenarios also passed separately on `qa1`.

## Recommended Next Steps

1. Finish syncing the root-level `.github`, `config`, and `tests` folders to `Evolent-Health/ClinicalTestAutomation` branch `EP-73761`; reconcile against the latest remote head and do not force-push.
2. Replace hard-coded account, database, and API credentials with environment variables and GitHub Environment secrets before sharing the repository further.
3. Configure the required GitHub secrets, then run the complete 22-scenario `@NoTouch` suite from Actions against `qa1`.
4. Revalidate the full Chromium suite after the latest Useful Documents scenario was added; expand to Firefox and WebKit where supported.
5. Add focused SQL retriever tests for query selection, placeholder substitution, and missing database configuration.
6. Consider a reusable authenticated page fixture to reduce repeated login helpers across specs.

## Validation Commands

```powershell
npx tsc --noEmit
$env:TEST_ENV = "qa1"
npx playwright test --project=chromium --grep "@NoTouch"
npx playwright test tests/Carepro/ProviderPortal/UsefulTools/PP_UT_UsefulDocuments.spec.ts --project=chromium
npx playwright test
```

## Environment Selection

Use `TEST_ENV` to select the environment. When it is not set, tests use `qa1`.

```powershell
$env:TEST_ENV = "shdev"
npx playwright test
```
