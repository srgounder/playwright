type EnvironmentCredentials = {
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

export const environments: Record<string, EnvironmentCredentials> = Object.freeze({
  dev: Object.freeze({}),
  prod: Object.freeze({}),
  pte: Object.freeze({}),
  shqa: Object.freeze({
    intakeUMUser: 'svc_auto_ic2',
    intakeUMPassword: 'AutomationAug2026!',
    CRUMUser: 'svc_auto_cr2',
    CRUMPassword: 'AutomationAug2026!',
    FLRUMUser: 'svc_auto_flr2',
    FLRUMPassword: 'AutomationAug2026!',
    CRMUser: 'dummy',
    CRMPwd: 'dummy',
    OfficeManagerUserName: 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: '!?+w(7P8R+',
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
  ut: Object.freeze({}),
  ct: Object.freeze({}),
  uat: Object.freeze({}),
});

const normalizedEnvironmentName = (process.env.TEST_ENV || 'shqa').toLowerCase();
const environmentKey = normalizedEnvironmentName as keyof typeof environments;
const credentials = environments[environmentKey] ?? {};

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
    username: envCreds.intakeUMUser || envCreds.username || '',
    password: envCreds.intakeUMPassword || envCreds.password || '',
    displayName: process.env.QA_INTAKE_DISPLAY_NAME || 'Automation IC',
    roleTab: 'Intake Coordinator',
  }),
  flr: Object.freeze({
    userType: 'First Level Reviewer user',
    username: envCreds.FLRUMUser,
    password: envCreds.FLRUMPassword,
    displayName: process.env.QA_FLR_DISPLAY_NAME,
    roleTab: 'First Level Reviewer',
  }),
  clr: Object.freeze({
    userType: 'Clinical Reviewer user',
    username: envCreds.CRMUser || envCreds.CUMUser || envCreds.CRUMUser,
    password: envCreds.CRMPwd || envCreds.CRUMPassword,
    displayName: process.env.QA_CLR_DISPLAY_NAME,
    roleTab: 'Clinical Reviewer',
  }),
  pharmacy: Object.freeze({
    userType: 'Pharmacy Reviewer user',
    username: envCreds.PharmacyUser,
    password: envCreds.PharmacyPassword,
    displayName: process.env.QA_PHARMACY_DISPLAY_NAME,
    roleTab: 'Pharmacy',
  }),
  officeManager: Object.freeze({
    userType: 'Office Manager user',
    username: envCreds.OfficeManagerUserName,
    password: envCreds.OfficeManagerPassword,
    displayName: process.env.QA_OFFICE_MANAGER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  provider: Object.freeze({
    userType: 'Provider user',
    username: envCreds.ProviderUserName,
    password: envCreds.ProviderPassword,
    displayName: process.env.QA_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  pcpProvider: Object.freeze({
    userType: 'PCP Provider user',
    username: envCreds.PCPProviderUserName,
    password: envCreds.PCPProviderPassword,
    displayName: process.env.QA_PCP_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
});

