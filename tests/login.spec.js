import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qacarepro.specialtycare.corp.evolenthealth.com/');
  await page.getByRole('textbox', { name: 'User name' }).click();
  await page.getByRole('textbox', { name: 'User name' }).fill('svc_auto_ic2');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('AutomationAug2026!');
  await page.getByRole('button', { name: 'Log On' }).click();
  await page.locator('#loggedInUser').getByText('Automation IC').click();
  await page.getByText('Log Off').click();
});