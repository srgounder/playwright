import { test, expect, type Page } from '@playwright/test';
import { connection, environmentName } from '../../../../config/carepro-environments-connectionstrings';
import { hasRealCredential, users } from '../../../../config/carepro-environments-account-credentials';

const usefulInfoScenarios = [
	{ user: users.officeManager, network: 'HUMANA TEXAS' },
	{ user: users.provider, network: 'HUMANA TENNESSEE' },
	{ user: users.pcpProvider, network: 'AETNA RISK FLORIDA' },
];

const usefulInfoUrl = connection.url('UsefulTools/UsefulInfo');

async function login(page: Page, username: string, password: string) {
	await page.goto(connection.url());
	await page.getByRole('textbox', { name: 'User name' }).fill(username);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Log On' }).click();
	await expect(page.getByText('Provider Portal', { exact: true })).toBeVisible();
}

async function openExternalLink(page: Page, linkName: string, destination: string) {
	const expectedOrigin = new URL(destination).origin;
	const popupPromise = page.waitForEvent('popup', { timeout: 15_000 }).catch(() => undefined);
	const navigationPromise = page
		.waitForURL((url) => url.origin === expectedOrigin, { timeout: 15_000 })
		.then(() => page)
		.catch(() => undefined);

	await page.getByRole('link', { name: linkName, exact: true }).click();
	const destinationPage = await Promise.race([popupPromise, navigationPromise]);
	const openedPage = destinationPage || page;
	await openedPage.waitForLoadState('domcontentloaded');
	await expect(openedPage).toHaveURL(new RegExp(`^${expectedOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
	return openedPage;
}

async function returnToUsefulInfo(page: Page, externalPage: Page) {
	if (externalPage !== page) {
		await externalPage.close();
	}
	await page.goto(usefulInfoUrl);
	await expect(page.locator('div.nchPortalTitleContainer1bold')).toContainText('Useful');
	await expect(page.locator('div.nchPortalTitleContainer1bold')).toContainText('Information');
}

for (const { user, network } of usefulInfoScenarios) {
	test(
		`validates Useful Information for ${user.userType} on ${network}`,
		{ tag: ['@PPUsefulInfo', '@ProviderPortal', '@NoTouch', '@ProdSmoke', '@PTESmoke'] },
		async ({ page }) => {
			test.slow();
			test.skip(
				!hasRealCredential(user.username) || !hasRealCredential(user.password),
				`${user.userType} credentials are not configured for this environment`,
			);

			await login(page, user.username ?? '', user.password ?? '');
			await page.getByText('Useful Tools', { exact: true }).click();
			await page.getByText('Useful Info', { exact: true }).click();

			const pageTitle = page.locator('div.nchPortalTitleContainer1bold');
			await expect(pageTitle).toContainText('Useful');
			await expect(pageTitle).toContainText('Information');

			const networkSelect = page.locator('#networkSelect');
			await networkSelect.selectOption({ label: network });
			await expect(networkSelect.locator('option:checked')).toHaveText(network);

			const informationRow = page.locator('tr.searchSelectRow').first();
			await expect(informationRow).toBeVisible();
			await informationRow.click();

			if (environmentName === 'prod' || environmentName === 'pte') {
				await expect(page.getByText('NCCN', { exact: true })).toBeVisible();

				const nccnPage = await openExternalLink(page, 'www.nccn.org', 'https://www.nccn.org/');
				await expect(nccnPage.getByRole('link', { name: 'Login', exact: true }).first()).toBeVisible();
				await returnToUsefulInfo(page, nccnPage);

				const goldStandardPage = await openExternalLink(
					page,
					'www.goldstandard.com',
					'https://www.elsevier.com/solutions/drug-information',
				);
				await returnToUsefulInfo(page, goldStandardPage);

				const ahfsPage = await openExternalLink(
					page,
					'www.ahfsdruginformation.com',
					'https://ahfs.ashp.org/',
				);
				await returnToUsefulInfo(page, ahfsPage);
			} else {
				const demoPage = await openExternalLink(page, 'DEMO', 'https://player.vimeo.com/video/289134085');
				await returnToUsefulInfo(page, demoPage);
			}
		},
	);
}