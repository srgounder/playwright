import { test, expect } from '@playwright/test';
import { connection, hasRealCredential } from '../config/environments';

test.skip(
  !hasRealCredential(connection.username) || !hasRealCredential(connection.password),
  'QA credentials are not configured for this environment',
);

test('test', async ({ page }) => {
  await page.goto(connection.url());
  await page.getByRole('textbox', { name: 'User name' }).click();
  await page.getByRole('textbox', { name: 'User name' }).fill(connection.username);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(connection.password);
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.locator('#loggedInUser').getByText('Automation IC').click();
  await page.getByText('Log Off').click();
});
