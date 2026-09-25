import { test, expect, type Page } from '@playwright/test';
import { connection } from '../../../../config/carepro-environments-connectionstrings';
import { hasRealCredential, users } from '../../../../config/carepro-environments-account-credentials';

const providerPortalUsers = [
  users.officeManager,
  users.provider,
  users.pcpProvider,
];

async function login(page: Page, username: string, password: string) {
  await page.goto(connection.url());
  await page.getByRole('textbox', { name: 'User name' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log On' }).click();
  await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
}

async function openAboutEvolent(page: Page) {
  await page.getByText('Home', { exact: true }).click();
  const aboutLink = page.getByText('About Evolent', { exact: true });
  await expect(aboutLink).toBeVisible();

  const popupPromise = page.waitForEvent('popup', { timeout: 15_000 }).catch(() => undefined);
  const navigationPromise = page
    .waitForURL('https://www.evolent.com/**', { timeout: 15_000 })
    .then(() => page)
    .catch(() => undefined);

  await aboutLink.click();
  const destination = await Promise.race([popupPromise, navigationPromise]);
  const aboutPage = destination || page;

  await aboutPage.waitForLoadState('domcontentloaded');
  await expect(aboutPage).toHaveURL(/https:\/\/www\.evolent\.com\//);
  return aboutPage;
}

for (const user of providerPortalUsers) {
  test(`validates About Evolent link for ${user.userType}`, async ({ page }) => {
    test.skip(
      !hasRealCredential(user.username) || !hasRealCredential(user.password),
      `${user.userType} credentials are not configured for this environment`,
    );

    await login(page, user.username ?? '', user.password ?? '');
    const aboutPage = await openAboutEvolent(page);

    await expect(aboutPage.getByText('Provider Log-in', { exact: true })).toBeVisible();
    await expect(aboutPage.getByText('Contact Us', { exact: true })).toBeVisible();
    await expect(aboutPage.getByText('Solutions', { exact: true })).toBeVisible();
  });
}
