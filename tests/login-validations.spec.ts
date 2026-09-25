import { test, expect, type Page } from '@playwright/test';
import { connection, hasRealCredential, users } from '../config/environments';

const validationMessages: Record<string, string> = {
  usernameRequired: 'The User name field is required.',
  passwordRequired: 'The Password field is required.',
  invalidCredentials: 'The user name or password provided is incorrect.',
};

const providerPortalLinks = [
  'Auth Status Tracker',
  'Home',
  'Useful Tools',
  'New Request',
  'Dashboard',
  'Outcomes Reporting Pilot',
];

type UserEntry = {
  userType: string;
  username?: string;
  password?: string;
  displayName?: string;
  roleTab: string;
  providerPortal?: boolean;
};

const getLoginControls = (page: Page) => ({
  username: page.getByRole('textbox', { name: 'User name' }),
  password: page.getByRole('textbox', { name: 'Password' }),
  submit: page.getByRole('button', { name: 'Log On' }),
});

async function expectInvalidCredentials(page: Page) {
  await expect(page.getByText(validationMessages.invalidCredentials, { exact: true })).toBeVisible();
}

async function verifyRole(page: Page, user: UserEntry) {
  const roleOption = page.locator(`[dropdown="role"][name="${user.roleTab}"]`);
  if (await roleOption.isVisible()) {
    await roleOption.click();
  }

  if (user.providerPortal) {
    await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
    for (const link of providerPortalLinks) {
      await expect(page.getByText(link, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('Advanced Search', { exact: true })).toBeVisible();
    return;
  }

  await expect(page.getByText('Home', { exact: true })).toBeVisible();

  if (user.roleTab === 'Intake Coordinator') {
    for (const link of ['My View', 'ALL', 'Intake', 'Notification']) {
      await expect(page.getByText(link, { exact: true })).toBeVisible();
    }
    return;
  }

  if (user.roleTab === 'First Level Reviewer') {
    await expect(page.getByText('Intake', { exact: true })).toBeHidden();
    await expect(page.getByText('Drafts', { exact: true })).toBeHidden();
    return;
  }

  for (const link of ['My View', 'ALL', 'Notification']) {
    await expect(page.getByText(link, { exact: true })).toBeVisible();
  }
  await expect(page.getByText('Intake', { exact: true })).toBeHidden();
}

async function logOut(page: Page) {
  await page.locator('#loggedInUser span[data-bind="text: displayName"]').click();
  const logOff = page.getByText('Log Off', { exact: true });
  await expect(logOff).toBeVisible();
  await logOff.click();
  await expect(page.getByRole('textbox', { name: 'User name' })).toBeVisible();
}

for (const user of Object.values(users) as UserEntry[]) {
  test(`validates CarePro login for ${user.userType}`, async ({ page }) => {
    test.skip(
      !hasRealCredential(user.username) || !hasRealCredential(user.password),
      `${user.userType} QA credentials are not configured`,
    );

    const usernameValue = user.username ?? '';
    const passwordValue = user.password ?? '';

    await page.goto(connection.url());
    const { username, password, submit } = getLoginControls(page);

    await submit.click();
    await expect(page.getByText(validationMessages.usernameRequired, { exact: true })).toBeVisible();
    await expect(page.getByText(validationMessages.passwordRequired, { exact: true })).toBeVisible();

    await password.fill(passwordValue);
    await submit.click();
    await expect(page.getByText(validationMessages.usernameRequired, { exact: true })).toBeVisible();

    await username.fill(usernameValue);
    await password.fill('abcd67gy');
    await submit.click();
    await expectInvalidCredentials(page);

    await username.fill('testuser');
    await password.fill(passwordValue);
    await submit.click();
    await expectInvalidCredentials(page);

    await username.fill('testuser');
    await password.fill('abc263');
    await submit.click();
    await expectInvalidCredentials(page);

    await username.fill(usernameValue);
    await password.fill(passwordValue);
    await submit.click();

    await expect(page.locator('#loggedInUser')).toContainText(user.displayName || usernameValue);
    await verifyRole(page, user);
    await logOut(page);
  });
}
