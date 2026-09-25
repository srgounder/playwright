export const environments = Object.freeze({
  qa: Object.freeze({
    baseUrl: process.env.QA_BASE_URL || 'https://qa1carepro.evolent.com/',
    username: process.env.QA_USERNAME || 'svc_auto_ic2',
    password: process.env.QA_PASSWORD || 'AutomationAug2026!',
  }),
});

const normalizedEnvironmentName = (process.env.TEST_ENV || 'qa').toLowerCase();
const environmentKey = normalizedEnvironmentName as keyof typeof environments;
const credentials = environments[environmentKey];

if (!credentials) {
  throw new Error(
    `Unsupported TEST_ENV "${normalizedEnvironmentName}". Available environments: ${Object.keys(environments).join(', ')}`,
  );
}

export const environmentName = normalizedEnvironmentName;
export const users = Object.freeze({
  intake: Object.freeze({
    userType: 'Intake Coordinator user',
    username: process.env.QA_INTAKE_USERNAME || credentials.username,
    password: process.env.QA_INTAKE_PASSWORD || credentials.password,
    displayName: process.env.QA_INTAKE_DISPLAY_NAME || 'Automation IC',
    roleTab: 'Intake Coordinator',
  }),
  flr: Object.freeze({
    userType: 'First Level Reviewer user',
    username: process.env.QA_FLR_USERNAME,
    password: process.env.QA_FLR_PASSWORD,
    displayName: process.env.QA_FLR_DISPLAY_NAME,
    roleTab: 'First Level Reviewer',
  }),
  clr: Object.freeze({
    userType: 'Clinical Reviewer user',
    username: process.env.QA_CLR_USERNAME,
    password: process.env.QA_CLR_PASSWORD,
    displayName: process.env.QA_CLR_DISPLAY_NAME,
    roleTab: 'Clinical Reviewer',
  }),
  pharmacy: Object.freeze({
    userType: 'Pharmacy Reviewer user',
    username: process.env.QA_PHARMACY_USERNAME,
    password: process.env.QA_PHARMACY_PASSWORD,
    displayName: process.env.QA_PHARMACY_DISPLAY_NAME,
    roleTab: 'Pharmacy',
  }),
  officeManager: Object.freeze({
    userType: 'Office Manager user',
    username: process.env.QA_OFFICE_MANAGER_USERNAME,
    password: process.env.QA_OFFICE_MANAGER_PASSWORD,
    displayName: process.env.QA_OFFICE_MANAGER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  provider: Object.freeze({
    userType: 'Provider user',
    username: process.env.QA_PROVIDER_USERNAME,
    password: process.env.QA_PROVIDER_PASSWORD,
    displayName: process.env.QA_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  pcpProvider: Object.freeze({
    userType: 'PCP Provider user',
    username: process.env.QA_PCP_PROVIDER_USERNAME,
    password: process.env.QA_PCP_PROVIDER_PASSWORD,
    displayName: process.env.QA_PCP_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
});

export const connection = Object.freeze({
  ...credentials,
  users,
  url: (path = '/') => new URL(path, credentials.baseUrl).toString(),
});

export { credentials, environments };
