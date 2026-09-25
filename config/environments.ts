type EnvironmentConfig = {
  baseUrl: string;
  username?: string;
  password?: string;
  intakeUMUser?: string;
  intakeUMPassword?: string;
  CRUMUser?: string;
  CRUMPassword?: string;
  FLRUMUser?: string;
  FLRUMPassword?: string;
  CRMUser?: string;
  CRMPwd?: string;
  OfficeManagerUserName?: string;
  OfficeManagerPassword?: string;
  ProviderUserName?: string;
  ProviderPassword?: string;
  PCPProviderUserName?: string;
  PCPProviderPassword?: string;
  PharmacyUser?: string;
  PharmacyPassword?: string;
  [key: string]: unknown;
};

export const environments: Record<string, EnvironmentConfig> = Object.freeze({
  qa: Object.freeze({
    baseUrl: process.env.QA_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: process.env.QA_INTAKE_USERNAME || 'svc_auto_ic2',
    intakeUMPassword: process.env.QA_INTAKE_PASSWORD || 'Automation@2428',
    CRUMUser: process.env.QA_CLR_USERNAME || 'svc_auto_cr2',
    CRUMPassword: process.env.QA_CLR_PASSWORD || 'Automation@2428',
    FLRUMUser: process.env.QA_FLR_USERNAME || 'svc_auto_flr2',
    FLRUMPassword: process.env.QA_FLR_PASSWORD || 'Automation@2429',
    OfficeManagerUserName: process.env.QA_OFFICE_MANAGER_USERNAME || 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: process.env.QA_OFFICE_MANAGER_PASSWORD || 'Automation@2433',
    ProviderUserName: process.env.QA_PROVIDER_USERNAME || 'svc_auto_provider2',
    ProviderPassword: process.env.QA_PROVIDER_PASSWORD || 'Automation@2431',
    PCPProviderUserName: process.env.QA_PCP_PROVIDER_USERNAME || 'svc_auto_pcpprovider2',
    PCPProviderPassword: process.env.QA_PCP_PROVIDER_PASSWORD || 'Automation@2431',
    PharmacyUser: process.env.QA_PHARMACY_USERNAME || 'svc_auto_rph2',
    PharmacyPassword: process.env.QA_PHARMACY_PASSWORD || 'Automation@2431',
    CRMUser: 'dummy',
    CRMPwd: 'dummy',
    intakeUMUser1: 'svc_auto_ic1',
    intakeUMPassword1: '$/a[;=ehZA',
    CRUMUser1: 'svc_auto_cr1',
    CRUMPassword1: 'Ya{;A*XG*_',
    FLRUMUser1: 'svc_auto_flr1',
    FLRUMPassword1: 'bIIR5C|Aa[',
    ProviderUserName1: 'svc_auto_provider1',
    ProviderPassword1: 'Automation@2431',
    UserManagementUMUser: 'svc_auto_usermanagement',
    UserManagementUMPassword: 'Na:g{]{qrnX0|=',
    Impl_Intakeumportal: 'intakeumportal',
    Impl_IntakeumPassword: 'TestingOct2024',
  }),
  shqa: Object.freeze({
    baseUrl: process.env.SHQA_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: 'svc_auto_ic2',
    intakeUMPassword: 'AutomationAug2026!',
    CRUMUser: 'svc_auto_cr2',
    CRUMPassword: 'AutomationAug2026!',
    FLRUMUser: 'svc_auto_flr2',
    FLRUMPassword: 'AutomationAug2026!',
    CRMUser: 'dummy',
    CRMPwd: 'dummy',
    OfficeManagerUserName: 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: 'SvdV@o)U*s',
    ProviderUserName: 'svc_auto_provider2',
    ProviderPassword: 'AutomationAug2026!',
    PCPProviderUserName: 'svc_auto_pcpprovider2',
    PCPProviderPassword: '7&_C*tYc%}',
    PharmacyUser: 'svc_auto_rph2',
    PharmacyPassword: 'AutomationAug2026!',
    PCPProviderUserName1: 'svc_auto_pcpprovider1',
    PCPProviderPassword1: '1;zB!W&Fe0',
    intakeUMUser1: 'svc_auto_ic1',
    intakeUMPassword1: 'Automation@2427',
    CRUMUser1: 'svc_auto_cr1',
    CRUMPassword1: 'Automation@2427',
    FLRUMUser1: 'svc_auto_flr1',
    FLRUMPassword1: 'Automation@2427',
    ProviderUserName1: 'svc_auto_provider1',
    ProviderPassword1: 'Automation@2427',
    UserManagementUMUser: 'svc_auto_usermanagement',
    UserManagementUMPassword: 'LqO6aI_2%s',
    Impl_Intakeumportal: 'intakeumportal',
    Impl_IntakeumPassword: 'TestingOct2024',
    OfficeManagerUserName1: 'aofficemanager1',
    OfficeManagerPassword1: '+/x2PfeS]M',
  }),
  shdev: Object.freeze({
    baseUrl: process.env.SHDEV_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: 'svc_auto_ic2',
    intakeUMPassword: 's&:Q^PL|p7',
    CRUMUser: 'svc_auto_cr2',
    CRUMPassword: 'L(EwohIWFA',
    FLRUMUser: 'svc_auto_flr2',
    FLRUMPassword: 'x#AP>o7RYd',
    CRMUser: 'dummy',
    CRMPwd: 'dummy',
    OfficeManagerUserName: 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: 'rLPYK8xBTq',
    ProviderUserName: 'svc_auto_provider2',
    ProviderPassword: 'HVuVLd%U%k',
    PCPProviderUserName: 'svc_auto_pcpprovider2',
    PCPProviderPassword: '-q_9#UT@rA',
    PharmacyUser: 'svc_auto_rph2',
    PharmacyPassword: 'xv}.rYs!hq',
    PCPProviderUserName1: 'svc_auto_pcpprovider1',
    PCPProviderPassword1: 'tzMhN6^G$#',
    intakeUMUser1: 'svc_auto_ic1',
    intakeUMPassword1: 'Automation@2026',
    CRUMUser1: 'svc_auto_cr1',
    CRUMPassword1: 'Automation@2026',
    FLRUMUser1: 'svc_auto_flr1',
    FLRUMPassword1: 'Automation@2026',
    ProviderUserName1: 'svc_auto_provider1',
    ProviderPassword1: 'Automation@2026',
    UserManagementUMUser: 'svc_auto_usermanagement',
    UserManagementUMPassword: 'Na:g{]{qrnX0|=',
    Impl_Intakeumportal: 'intakeumportal',
    Impl_IntakeumPassword: 'TestingOct2024',
  }),
  ut: Object.freeze({
    baseUrl: process.env.UT_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: '__intakeUMUser__',
    intakeUMPassword: '__intakeUMPassword__',
    CRUMUser: '__CRUMUser__',
    CRUMPassword: '__CRUMPassword__',
    FLRUMUser: '__FLRUMUser__',
    FLRUMPassword: '__FLRUMPassword__',
    CRMUser: '__CRMUser__',
    CRMPwd: '__CRMPwd__',
    OfficeManagerUserName: '__OfficeManagerUserName__',
    OfficeManagerPassword: '__OfficeManagerPassword__',
    ProviderUserName: '__ProviderUserName__',
    ProviderPassword: '__ProviderPassword__',
    PCPProviderUserName: '__PCPProviderUserName__',
    PCPProviderPassword: '__PCPProviderPassword__',
    PharmacyUser: '__PharmacyUser__',
    PharmacyPassword: '__PharmacyPassword__',
  }),
  uat: Object.freeze({
    baseUrl: process.env.UAT_BASE_URL || 'https://qa1carepro.evolent.com/',
  }),
  dev: Object.freeze({
    baseUrl: process.env.DEV_BASE_URL || 'https://qa1carepro.evolent.com/',
  }),
  pte: Object.freeze({
    baseUrl: process.env.PTE_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: '__intakeUMUser__',
    intakeUMPassword: '__intakeUMPassword__',
    CRUMUser: '__CRUMUser__',
    CRUMPassword: '__CRUMPassword__',
    FLRUMUser: '__FLRUMUser__',
    FLRUMPassword: '__FLRUMPassword__',
    CRMUser: '__CRMUser__',
    CRMPwd: '__CRMPwd__',
    OfficeManagerUserName: '__OfficeManagerUserName__',
    OfficeManagerPassword: '__OfficeManagerPassword__',
    ProviderUserName: '__ProviderUserName__',
    ProviderPassword: '__ProviderPassword__',
    PCPProviderUserName: '__PCPProviderUserName__',
    PCPProviderPassword: '__PCPProviderPassword__',
    PharmacyUser: '__PharmacyUser__',
    PharmacyPassword: '__PharmacyPassword__',
  }),
  prod: Object.freeze({
    baseUrl: process.env.PROD_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: '__intakeUMUser__',
    intakeUMPassword: '__intakeUMPassword__',
    CRUMUser: '__CRUMUser__',
    CRUMPassword: '__CRUMPassword__',
    FLRUMUser: '__FLRUMUser__',
    FLRUMPassword: '__FLRUMPassword__',
    CRMUser: '__CRMUser__',
    CRMPwd: '__CRMPwd__',
    OfficeManagerUserName: '__OfficeManagerUserName__',
    OfficeManagerPassword: '__OfficeManagerPassword__',
    ProviderUserName: '__ProviderUserName__',
    ProviderPassword: '__ProviderPassword__',
    PCPProviderUserName: '__PCPProviderUserName__',
    PCPProviderPassword: '__PCPProviderPassword__',
    PharmacyUser: '__PharmacyUser__',
    PharmacyPassword: '__PharmacyPassword__',
  }),
  ct: Object.freeze({
    baseUrl: process.env.CT_BASE_URL || 'https://qa1carepro.evolent.com/',
    intakeUMUser: '__intakeUMUser__',
    intakeUMPassword: '__intakeUMPassword__',
    CRUMUser: '__CRUMUser__',
    CRUMPassword: '__CRUMPassword__',
    FLRUMUser: '__FLRUMUser__',
    FLRUMPassword: '__FLRUMPassword__',
    CRMUser: '__CRMUser__',
    CRMPwd: '__CRMPwd__',
    OfficeManagerUserName: '__OfficeManagerUserName__',
    OfficeManagerPassword: '__OfficeManagerPassword__',
    ProviderUserName: '__ProviderUserName__',
    ProviderPassword: '__ProviderPassword__',
    PCPProviderUserName: '__PCPProviderUserName__',
    PCPProviderPassword: '__PCPProviderPassword__',
    PharmacyUser: '__PharmacyUser__',
    PharmacyPassword: '__PharmacyPassword__',
  }),
});

const normalizedEnvironmentName = (process.env.TEST_ENV || 'qa').toLowerCase();
const environmentKey = normalizedEnvironmentName as keyof typeof environments;
const credentials = environments[environmentKey] ?? {
  baseUrl: process.env.QA_BASE_URL || 'https://qa1carepro.evolent.com/',
};

if (!credentials) {
  throw new Error(
    `Unsupported TEST_ENV "${normalizedEnvironmentName}". Available environments: ${Object.keys(environments).join(', ')}`,
  );
}

const envCreds = credentials as Record<string, string | undefined>;

export const environmentName = normalizedEnvironmentName;

export const hasRealCredential = (value?: string): boolean => {
  if (!value) {
    return false;
  }

  const normalized = value.trim();
  return normalized.length > 0 && !normalized.startsWith('__') && normalized.toLowerCase() !== 'dummy';
};

export const users = Object.freeze({
  intake: Object.freeze({
    userType: 'Intake Coordinator user',
    username: process.env.QA_INTAKE_USERNAME || envCreds.intakeUMUser || envCreds.username || '',
    password: process.env.QA_INTAKE_PASSWORD || envCreds.intakeUMPassword || envCreds.password || '',
    displayName: process.env.QA_INTAKE_DISPLAY_NAME || 'Automation IC',
    roleTab: 'Intake Coordinator',
  }),
  flr: Object.freeze({
    userType: 'First Level Reviewer user',
    username: process.env.QA_FLR_USERNAME || envCreds.FLRUMUser,
    password: process.env.QA_FLR_PASSWORD || envCreds.FLRUMPassword,
    displayName: process.env.QA_FLR_DISPLAY_NAME,
    roleTab: 'First Level Reviewer',
  }),
  clr: Object.freeze({
    userType: 'Clinical Reviewer user',
    username: process.env.QA_CLR_USERNAME || envCreds.CRMUser || envCreds.CUMUser || envCreds.CRUMUser,
    password: process.env.QA_CLR_PASSWORD || envCreds.CRMPwd || envCreds.CRUMPassword,
    displayName: process.env.QA_CLR_DISPLAY_NAME,
    roleTab: 'Clinical Reviewer',
  }),
  pharmacy: Object.freeze({
    userType: 'Pharmacy Reviewer user',
    username: process.env.QA_PHARMACY_USERNAME || envCreds.PharmacyUser,
    password: process.env.QA_PHARMACY_PASSWORD || envCreds.PharmacyPassword,
    displayName: process.env.QA_PHARMACY_DISPLAY_NAME,
    roleTab: 'Pharmacy',
  }),
  officeManager: Object.freeze({
    userType: 'Office Manager user',
    username: process.env.QA_OFFICE_MANAGER_USERNAME || envCreds.OfficeManagerUserName,
    password: process.env.QA_OFFICE_MANAGER_PASSWORD || envCreds.OfficeManagerPassword,
    displayName: process.env.QA_OFFICE_MANAGER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  provider: Object.freeze({
    userType: 'Provider user',
    username: process.env.QA_PROVIDER_USERNAME || envCreds.ProviderUserName,
    password: process.env.QA_PROVIDER_PASSWORD || envCreds.ProviderPassword,
    displayName: process.env.QA_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  pcpProvider: Object.freeze({
    userType: 'PCP Provider user',
    username: process.env.QA_PCP_PROVIDER_USERNAME || envCreds.PCPProviderUserName,
    password: process.env.QA_PCP_PROVIDER_PASSWORD || envCreds.PCPProviderPassword,
    displayName: process.env.QA_PCP_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
});

export const connection = Object.freeze({
  ...credentials,
  username: process.env.QA_USERNAME || envCreds.intakeUMUser || envCreds.username || '',
  password: process.env.QA_PASSWORD || envCreds.intakeUMPassword || envCreds.password || '',
  users,
  url: (path = '/') => new URL(path, credentials.baseUrl).toString(),
});
