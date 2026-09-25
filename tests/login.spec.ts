import { test, expect } from '@playwright/test';
import { connection } from '../config/environment-connections';
import { hasRealCredential, users } from '../config/environment-credentials';

test.skip(
  !hasRealCredential(users.intake.username) || !hasRealCredential(users.intake.password),
  'QA credentials are not configured for this environment',
);

test('test', async ({ page }) => {
  await page.goto(connection.url());
  await page.getByRole('textbox', { name: 'User name' }).click();
  await page.getByRole('textbox', { name: 'User name' }).fill(users.intake.username);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(users.intake.password);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.locator('#loggedInUser').getByText('Automation IC').click();
  await page.getByText('Log Off').click();
});
