import { promises as fs } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { connection } from '../../../../config/carepro-environments-connectionstrings';
import { hasRealCredential, users } from '../../../../config/carepro-environments-account-credentials';

const providerPortalUsers = [
	users.officeManager,
	users.provider,
	users.pcpProvider,
];

const downloadHelpText =
	'Evolent is not liable for the accuracy of the downloaded information once it leaves the system. For the most recent information, please refer to the data in the Evolent Portal.';

async function login(page: Page, username: string, password: string) {
	await page.goto(connection.url());
	await page.getByRole('textbox', { name: 'User name' }).fill(username);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Log On' }).click();
	await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
}

for (const user of providerPortalUsers) {
	test(`validates Download CSV for ${user.userType}`, { tag: ['@NoTouch', '@ProviderPortal'] }, async ({ page }, testInfo) => {
		test.skip(
			!hasRealCredential(user.username) || !hasRealCredential(user.password),
			`${user.userType} credentials are not configured for this environment`,
		);

		await login(page, user.username ?? '', user.password ?? '');
		await page.getByText('Home', { exact: true }).click();

		await expect(page.getByRole('heading', { name: 'Download Data', exact: true })).toBeVisible();
		await expect(page.getByText(downloadHelpText, { exact: true })).toBeVisible();

		const downloadPromise = page.waitForEvent('download');
		await page.locator('#btnDownload').click();
		const download = await downloadPromise;

		await expect(download.suggestedFilename()).toMatch(/\.csv$/i);
		expect(await download.failure()).toBeNull();
		const downloadedFilePath = testInfo.outputPath(download.suggestedFilename());
		await download.saveAs(downloadedFilePath);
		const downloadedFile = await fs.stat(downloadedFilePath);
		expect(downloadedFile.isFile()).toBe(true);
		expect(downloadedFile.size).toBeGreaterThan(0);
		const csvContent = await fs.readFile(downloadedFilePath, 'utf8');
		expect(csvContent.trim()).not.toBe('');
	});
}
