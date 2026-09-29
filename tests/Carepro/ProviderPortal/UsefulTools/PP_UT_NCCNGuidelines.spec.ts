import { test, expect, type Page } from '@playwright/test';
import { connection } from '../../../../config/carepro-environments-connectionstrings';
import { hasRealCredential, users } from '../../../../config/carepro-environments-account-credentials';

const providerPortalUsers = [
	users.officeManager,
	users.provider,
	users.pcpProvider,
];

const nccnGuidelinesUrl = 'https://www.nccn.org/guidelines/category_1';
const nccnCatalogUrl = 'https://www.nccn.org/home/store/Products/Catalog.aspx';

async function login(page: Page, username: string, password: string) {
	await page.goto(connection.url());
	await page.getByRole('textbox', { name: 'User name' }).fill(username);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Log On' }).click();
	await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
}

async function openExternalLink(page: Page, link: ReturnType<Page['getByRole']>, destination: string) {
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
	return openedPage;
}

type ProviderPortalUser = (typeof providerPortalUsers)[number];

async function validateNccnGuidelines(page: Page, user: ProviderPortalUser) {
	test.skip(
		!hasRealCredential(user.username) || !hasRealCredential(user.password),
		`${user.userType} credentials are not configured for this environment`,
	);

	await login(page, user.username ?? '', user.password ?? '');
	await page.getByText('Useful Tools', { exact: true }).click();
	await page.getByText('NCCN Guidelines', { exact: true }).click();

	await expect(page.getByText('NCCN Information', { exact: true })).toBeVisible();
	const nccnInformationText = page
		.locator('span')
		.filter({ hasText: 'For your convenience, free access to the NCCN Guidelines' })
		.first();
	await expect(nccnInformationText).toBeVisible();
	await expect(nccnInformationText).toContainText('is available by');

	const guidelinesPage = await openExternalLink(
		page,
		page.getByRole('link', { name: 'clicking here.', exact: true }),
		nccnGuidelinesUrl,
	);
	await expect(guidelinesPage.getByRole('link', { name: 'Home', exact: true }).first()).toBeVisible();

	if (guidelinesPage !== page) {
		await guidelinesPage.close();
	}

	await page.goto(connection.url('Help/GetNccnInfo'));
	const catalogPage = await openExternalLink(
		page,
		page.getByRole('link', { name: 'Click here to purchase a subscription.', exact: true }),
		nccnCatalogUrl,
	);
	await expect(catalogPage.getByRole('link', { name: 'Login', exact: true }).first()).toBeVisible();

	if (catalogPage !== page) {
		await catalogPage.close();
	}
}

for (const user of providerPortalUsers) {
	test(`validates NCCN Guidelines for ${user.userType}`, { tag: ['@ProviderPortal', '@NoTouch']  }, async ({ page }) => {
		await validateNccnGuidelines(page, user);
	});
}
