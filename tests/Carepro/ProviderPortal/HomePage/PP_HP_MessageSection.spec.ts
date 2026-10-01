import { test, expect, type Page } from '@playwright/test';
import { connection, environmentName } from '../../../../playwright.config';
import { hasRealCredential, users } from '../../../../config/carepro-environments-account-credentials';

const providerPortalUsers = [
	users.officeManager,
	users.provider,
	users.pcpProvider,
];

const messageLinks = [
	{
		name: 'Weekend Submission',
		destination: /ExternalContent\/Weekend%20Submissons-%20Provider%20Alert\.pdf$/i,
	},
	{
		name: 'HOPA Statement',
		destination: /ExternalContent\/HOPA\.pdf$/i,
	},
	{
		name: 'Humana',
		destination: /ExternalContent\/HumanaDeclarations\.pdf$/i,
	},
];

async function login(page: Page, username: string, password: string) {
	await page.goto(connection.url());
	await page.getByRole('textbox', { name: 'User name' }).fill(username);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Log On' }).click();
	await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
}

async function toggleMessageSection(page: Page) {
	const messageSection = page.locator('h3').filter({ hasText: /^Message$/ }).first();

	await expect(messageSection).toBeVisible();
	await expect(messageSection).toHaveClass(/ui-corner-top/);

	await messageSection.click();
	await expect(messageSection).toHaveClass(/ui-corner-all/);

	await messageSection.click();
	await expect(messageSection).toHaveClass(/ui-corner-top/);
}

async function validateMessageLink(page: Page, name: string, destination: RegExp) {
	const link = page.getByRole('link', { name, exact: true }).first();
	await expect(link).toBeVisible();

	const popupPromise = page.waitForEvent('popup', { timeout: 15_000 }).catch(() => undefined);
	const navigationPromise = page
		.waitForURL(destination, { timeout: 15_000 })
		.then(() => page)
		.catch(() => undefined);

	await link.click();
	const destinationPage = await Promise.race([popupPromise, navigationPromise]);
	const openedPage = destinationPage || page;

	await openedPage.waitForLoadState('domcontentloaded');
	await expect(openedPage).toHaveURL(destination);

	if (openedPage !== page) {
		await openedPage.close();
	} else {
		await page.goto(connection.url('Home/ProviderHome/Home'));
	}
}

for (const user of providerPortalUsers) {
	test(`validates Provider Portal Message section for ${user.userType}`, { tag: ['@NoTouch', '@ProviderPortal'] }, async ({ page }) => {
		test.skip(
			!hasRealCredential(user.username) || !hasRealCredential(user.password),
			`${user.userType} credentials are not configured for this environment`,
		);

		await login(page, user.username ?? '', user.password ?? '');
		await page.getByText('Home', { exact: true }).click();
		await toggleMessageSection(page);

		if (environmentName === 'qa1') {
			for (const messageLink of messageLinks) {
				await validateMessageLink(page, messageLink.name, messageLink.destination);
			}

			const messageSection = page.locator('h3').filter({ hasText: /^Message$/ }).first();
			await messageSection.click();
			await expect(messageSection).toHaveClass(/ui-corner-all/);
		}
	});
}
