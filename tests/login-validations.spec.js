import { test, expect } from '@playwright/test';
const { connection, users } = require('../config/environments');

const validationMessages = {
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

const getLoginControls = (page) => ({
  username: page.getByRole('textbox', { name: 'User name' }),
  password: page.getByRole('textbox', { name: 'Password' }),
  submit: page.getByRole('button', { name: 'Log On' }),
});

async function expectInvalidCredentials(page) {
  await expect(page.getByText(validationMessages.invalidCredentials, { exact: true })).toBeVisible();
}

async function verifyRole(page, user) {
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

async function logOut(page) {
  await page.locator('#loggedInUser span[data-bind="text: displayName"]').click();
  const logOff = page.getByText('Log Off', { exact: true });
  await expect(logOff).toBeVisible();
  await logOff.click();
  await expect(page.getByRole('textbox', { name: 'User name' })).toBeVisible();
}

for (const user of Object.values(users)) {
  test(`validates CarePro login for ${user.userType}`, async ({ page }) => {
    test.skip(!user.username || !user.password, `${user.userType} QA credentials are not configured`);

    await page.goto(connection.url());
    const { username, password, submit } = getLoginControls(page);

    await submit.click();
    await expect(page.getByText(validationMessages.usernameRequired, { exact: true })).toBeVisible();
    await expect(page.getByText(validationMessages.passwordRequired, { exact: true })).toBeVisible();

    await password.fill(user.password);
    await submit.click();
    await expect(page.getByText(validationMessages.usernameRequired, { exact: true })).toBeVisible();

    await username.fill(user.username);
    await password.fill('abcd67gy');
    await submit.click();
    await expectInvalidCredentials(page);

    await username.fill('testuser');
    await password.fill(user.password);
    await submit.click();
    await expectInvalidCredentials(page);

    await username.fill('testuser');
    await password.fill('abc263');
    await submit.click();
    await expectInvalidCredentials(page);

    await username.fill(user.username);
    await password.fill(user.password);
    await submit.click();

    await expect(page.locator('#loggedInUser')).toContainText(user.displayName || user.username);
    await verifyRole(page, user);
    await logOut(page);
  });
}