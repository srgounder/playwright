import { defineConfig, devices } from '@playwright/test';
import { execFileSync } from 'node:child_process';

export type EnvironmentConnection = {
  baseUrl?: string;
  appUrl?: string;
  appcrmurl?: string;
  crmApiUrl?: string;
  dbConfig?: {
    url?: string;
    username?: string;
    password?: string;
    driverClassName?: string;
  };
  careProPlusApiKey?: string;
  careProPlusBaseUrl?: string;
};

const dbUsername = process.env.CAREPRO_DB_USERNAME;
const dbPassword = process.env.CAREPRO_DB_PASSWORD;

export const environmentConnections: Record<string, EnvironmentConnection> = Object.freeze({
  dev: Object.freeze({
    baseUrl: process.env.DEV_BASE_URL || 'http://itgdevweb1.headquarters.newcenturyhealth.com/',
    appUrl: 'http://itgdevweb1.headquarters.newcenturyhealth.com/',
    appcrmurl: '',
    crmApiUrl: '',
    dbConfig: {
      url: 'jdbc:sqlserver://ITGQASQLCORECA1:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    careProPlusApiKey: '56056_eb23227861a7d187438fbaa2a53b7ea80ba0a13d7719f09b63964f661e369f61',
    careProPlusBaseUrl: 'http://itgappint1.headquarters.newcenturyhealth.com:8080',
  }),
  prod: Object.freeze({
    baseUrl: process.env.PROD_BASE_URL || 'https://carepro.evolent.com/',
    appUrl: 'https://carepro.evolent.com/',
    appcrmurl: 'crmca1.headquarters.newcenturyhealth.com/',
    crmApiUrl: 'http://appintvip.headquarters.newcenturyhealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://SQLCORE.specialtycare.corp.evolenthealth.com:1433;databaseName=Carepro_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  pte: Object.freeze({
    baseUrl: process.env.PTE_BASE_URL || 'https://ptecarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://ptecarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'pt-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://ptcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://PTSQLCORE.specialtycare.corp.evolenthealth.com:1433;databaseName=Carepro_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  qa1: Object.freeze({
    baseUrl: process.env.QA1_BASE_URL || 'https://qa1carepro.evolent.com/',
    appUrl: 'https://qa1carepro.evolent.com/',
    appcrmurl: 'qa-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://qacproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername || 'careproportalreader',
      password: dbPassword || 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  qa2: Object.freeze({
    appUrl: 'https://qa2carepro.evolent.com/',
    appcrmurl: 'qa-vm-cprocm-01.specialtycare.corp.evolenthealth.com/CareProQA2/',
    crmApiUrl: 'http://qa2cproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM2;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  shdev: Object.freeze({
    baseUrl: process.env.SHDEV_BASE_URL || 'https://dvcarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://dvcarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'dv-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://dvcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://dvsqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  ut: Object.freeze({
    baseUrl: process.env.UT_BASE_URL || 'https://utcarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://utcarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'ut-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://utcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://utsqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  ct: Object.freeze({
    baseUrl: process.env.CT_BASE_URL || 'https://clcarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://clcarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'http://tr-vm-cprocm-11.specialtycare.corp.evolenthealth.com/careprocl/main.aspx/',
    crmApiUrl: 'http://clcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.AuthorizationRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://clsqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=Carepro_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  data: Object.freeze({
    appUrl: 'https://qa-my.newcenturyhealth.com/',
    crmApiUrl: 'http://qaappintvip0.headquarters.newcenturyhealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.headquarters.newcenturyhealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    careProPlusApiKey: '56056_eb23227861a7d187438fbaa2a53b7ea80ba0a13d7719f09b63964f661e369f61',
    careProPlusBaseUrl: 'https://qaapp_careproplusvip.newcenturyhealth.com',
  }),
  uat: Object.freeze({
    appUrl: '',
    appcrmurl: '',
    crmApiUrl: '',
    dbConfig: {
      url: '',
      username: dbUsername,
      password: dbPassword,
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
});

const normalizedEnvironmentName = (process.env.TEST_ENV || 'qa1').trim().toLowerCase();
export const testEnvironment = normalizedEnvironmentName;
export const environmentName = normalizedEnvironmentName;
const selectedConnection = environmentConnections[environmentName] ?? environmentConnections.qa1;

const envCredentials = Object.freeze({
  qa1: Object.freeze({
    intakeUMUser: process.env.CAREPRO_INTAKE_UM_USER || 'svc_auto_ic2',
    intakeUMPassword: process.env.CAREPRO_INTAKE_UM_PASSWORD || 'Automation2026!!',
    CRUMUser: process.env.CAREPRO_CRUM_USER || 'svc_auto_cr2',
    CRUMPassword: process.env.CAREPRO_CRUM_PASSWORD || 'Automation2026!!',
    FLRUMUser: process.env.CAREPRO_FLRUM_USER || 'svc_auto_flr2',
    FLRUMPassword: process.env.CAREPRO_FLRUM_PASSWORD || 'Automation2026!!',
    OfficeManagerUserName: process.env.CAREPRO_OFFICE_MANAGER_USER || 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: process.env.CAREPRO_OFFICE_MANAGER_PASSWORD ||'Automation2026!!',
    ProviderUserName: process.env.CAREPRO_PROVIDER_USER || 'svc_auto_Provider2',
    ProviderPassword: process.env.CAREPRO_PROVIDER_PASSWORD || 'Automation2026!!' ,
    PCPProviderUserName: process.env.CAREPRO_PCP_PROVIDER_USER || 'svc_auto_pcpprovider2',
    PCPProviderPassword: process.env.CAREPRO_PCP_PROVIDER_PASSWORD || 'Automation2026!!',
    PharmacyUser: process.env.CAREPRO_PHARMACY_USER || 'svc_auto_rph2',
    PharmacyPassword: process.env.CAREPRO_PHARMACY_PASSWORD || 'Automation2026!!',
    PCPProviderUserName1: process.env.CAREPRO_PCP_PROVIDER_USER_1,
    PCPProviderPassword1: process.env.CAREPRO_PCP_PROVIDER_PASSWORD_1,
    intakeUMUser1: process.env.CAREPRO_INTAKE_UM_USER_1,
    intakeUMPassword1: process.env.CAREPRO_INTAKE_UM_PASSWORD_1,
    CRUMUser1: process.env.CAREPRO_CRUM_USER_1,
    CRUMPassword1: process.env.CAREPRO_CRUM_PASSWORD_1,
    FLRUMUser1: process.env.CAREPRO_FLRUM_USER_1,
    FLRUMPassword1: process.env.CAREPRO_FLRUM_PASSWORD_1,
    ProviderUserName1: process.env.CAREPRO_PROVIDER_USER_1,
    ProviderPassword1: process.env.CAREPRO_PROVIDER_PASSWORD_1,
    UserManagementUMUser: process.env.CAREPRO_USER_MANAGEMENT_UM_USER,
    UserManagementUMPassword: process.env.CAREPRO_USER_MANAGEMENT_UM_PASSWORD,
    Impl_Intakeumportal: process.env.CAREPRO_IMPL_INTAKE_UM_PORTAL,
    Impl_IntakeumPassword: process.env.CAREPRO_IMPL_INTAKE_UM_PASSWORD,
    OfficeManagerUserName1: process.env.CAREPRO_OFFICE_MANAGER_USER_1,
    OfficeManagerPassword1: process.env.CAREPRO_OFFICE_MANAGER_PASSWORD_1,
  }),
  qa2: Object.freeze({}),
  shdev: Object.freeze({}),
  dev: Object.freeze({}),
  prod: Object.freeze({}),
  pte: Object.freeze({}),
  ut: Object.freeze({}),
  ct: Object.freeze({}),
  uat: Object.freeze({}),
});

const credentials = environmentName in envCredentials ? envCredentials[environmentName as keyof typeof envCredentials] : Object.freeze({});

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
    username: (credentials as Record<string, string | undefined>).intakeUMUser || '',
    password: (credentials as Record<string, string | undefined>).intakeUMPassword || '',
    displayName: process.env.QA_INTAKE_DISPLAY_NAME || 'Automation IC',
    roleTab: 'Intake Coordinator',
  }),
  flr: Object.freeze({
    userType: 'First Level Reviewer user',
    username: (credentials as Record<string, string | undefined>).FLRUMUser || '',
    password: (credentials as Record<string, string | undefined>).FLRUMPassword || '',
    displayName: process.env.QA_FLR_DISPLAY_NAME,
    roleTab: 'First Level Reviewer',
  }),
  clr: Object.freeze({
    userType: 'Clinical Reviewer user',
    username: (credentials as Record<string, string | undefined>).CRUMUser || '',
    password: (credentials as Record<string, string | undefined>).CRUMPassword || '',
    displayName: process.env.QA_CLR_DISPLAY_NAME,
    roleTab: 'Clinical Reviewer',
  }),
  pharmacy: Object.freeze({
    userType: 'Pharmacy Reviewer user',
    username: (credentials as Record<string, string | undefined>).PharmacyUser || '',
    password: (credentials as Record<string, string | undefined>).PharmacyPassword || '',
    displayName: process.env.QA_PHARMACY_DISPLAY_NAME,
    roleTab: 'Pharmacy',
  }),
  officeManager: Object.freeze({
    userType: 'Office Manager user',
    username: (credentials as Record<string, string | undefined>).OfficeManagerUserName || '',
    password: (credentials as Record<string, string | undefined>).OfficeManagerPassword || '',
    displayName: process.env.QA_OFFICE_MANAGER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  provider: Object.freeze({
    userType: 'Provider user',
    username: (credentials as Record<string, string | undefined>).ProviderUserName || '',
    password: (credentials as Record<string, string | undefined>).ProviderPassword || '',
    displayName: process.env.QA_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
  pcpProvider: Object.freeze({
    userType: 'PCP Provider user',
    username: (credentials as Record<string, string | undefined>).PCPProviderUserName || '',
    password: (credentials as Record<string, string | undefined>).PCPProviderPassword || '',
    displayName: process.env.QA_PCP_PROVIDER_DISPLAY_NAME,
    roleTab: 'Provider Portal',
    providerPortal: true,
  }),
});

export const connection = Object.freeze({
  ...selectedConnection,
  url: (path = '/') => new URL(path, selectedConnection.baseUrl || '').toString(),
});

const runTimestamp = new Date().toISOString();
const reportTimestamp = runTimestamp.replace(/[:.]/g, '-');
const reportFolder = `playwright-report/${testEnvironment}-${reportTimestamp}`;
const branchName = process.env.GITHUB_HEAD_REF
  || process.env.GITHUB_REF_NAME
  || process.env.BUILD_SOURCEBRANCHNAME
  || process.env.CI_COMMIT_REF_NAME
  || process.env.BRANCH_NAME
  || process.env.BUILD_SOURCEBRANCH?.replace(/^refs\/heads\//, '')
  || execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim()
  || 'unknown';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [
      'html',
      {
        outputFolder: reportFolder,
        open: 'never',
      },
    ],
    ['json', { outputFile: 'test-results/results.json' }],
    [
      './reporters/pie-chart-reporter.ts',
      {
        reportFolder,
        testEnvironment,
        branchName,
        runTimestamp,
        open: !process.env.CI,
      },
    ],
  ],
  use: {
    screenshot: 'off',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
