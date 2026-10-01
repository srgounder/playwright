import { promises as fs } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { connection } from '../../../../playwright.config';
import { hasRealCredential, users } from '../../../../config/carepro-environments-account-credentials';

const documentScenarios = [
	{ user: users.officeManager, network: 'AMBETTER OF ILLINOIS' },
	{ user: users.provider, network: 'AETNA RISK FLORIDA' },
	{ user: users.pcpProvider, network: 'HUMANA FLORIDA' },
];

async function login(page: Page, username: string, password: string) {
	await page.goto(connection.url());
	await page.getByRole('textbox', { name: 'User name' }).fill(username);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Log On' }).click();
	await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
}

for (const { user, network } of documentScenarios) {
	test(
		`validates Useful Documents for ${user.userType} on ${network}`,
		{ tag: ['@NoTouch', '@ProviderPortal'] },
		async ({ page }, testInfo) => {
			test.slow();
			test.skip(
				!hasRealCredential(user.username) || !hasRealCredential(user.password),
				`${user.userType} credentials are not configured for this environment`,
			);

			await login(page, user.username ?? '', user.password ?? '');
			await page.getByText('Useful Tools', { exact: true }).click();
			await page.getByText('Useful Documents', { exact: true }).click();

			const pageTitle = page.locator('div.nchPortalTitleContainer1bold');
			await expect(pageTitle).toContainText('Documents');
			await expect(pageTitle).toContainText('Useful');

			const networkSelect = page.locator('#networkSelect');
			await networkSelect.selectOption({ label: network });
			await expect(networkSelect.locator('option:checked')).toHaveText(network);

			const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
			const documentRow = page.getByRole('row').filter({ hasText: 'Clinical Data Elements' }).first();
			await expect(documentRow).toBeVisible();
			await documentRow.click();
			const download = await downloadPromise;

			expect(await download.failure()).toBeNull();
			const downloadedFilePath = testInfo.outputPath(download.suggestedFilename());
			await download.saveAs(downloadedFilePath);
			const downloadedFile = await fs.stat(downloadedFilePath);
			expect(downloadedFile.isFile()).toBe(true);
			expect(downloadedFile.size).toBeGreaterThan(0);
			await expect(page.locator('#main')).toBeAttached();
		},
	);
}