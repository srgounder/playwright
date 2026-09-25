type EnvironmentConfig = {
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
  env?: string;
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
  careProPlusApiKey?: string;
  careProPlusBaseUrl?: string;
  [key: string]: unknown;
};

export const environments: Record<string, EnvironmentConfig> = Object.freeze({
  qa: Object.freeze({
    baseUrl: process.env.QA_BASE_URL || 'https://qa1carepro.evolent.com/',
    appUrl: 'https://qa1carepro.evolent.com/',
    appcrmurl: 'qa-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://qacproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    careProPlusApiKey: '56056_eb23227861a7d187438fbaa2a53b7ea80ba0a13d7719f09b63964f661e369f61',
    careProPlusBaseUrl: 'https://qaapp_careproplusvip.newcenturyhealth.com',
    env: 'qa',
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
  dev: Object.freeze({
    baseUrl: process.env.DEV_BASE_URL || 'http://itgdevweb1.headquarters.newcenturyhealth.com/',
    appUrl: 'http://itgdevweb1.headquarters.newcenturyhealth.com/',
    appcrmurl: '',
    crmApiUrl: '',
    dbConfig: {
      url: 'jdbc:sqlserver://ITGQASQLCORECA1:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: '__DbDevUser__',
      password: '__DbDevPwd__',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    careProPlusApiKey: '56056_eb23227861a7d187438fbaa2a53b7ea80ba0a13d7719f09b63964f661e369f61',
    careProPlusBaseUrl: 'http://itgappint1.headquarters.newcenturyhealth.com:8080',
    env: 'dev',
  }),
  prod: Object.freeze({
    baseUrl: process.env.PROD_BASE_URL || 'https://carepro.evolent.com/',
    appUrl: 'https://carepro.evolent.com/',
    appcrmurl: 'crmca1.headquarters.newcenturyhealth.com/',
    crmApiUrl: 'http://appintvip.headquarters.newcenturyhealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://SQLCORE.specialtycare.corp.evolenthealth.com:1433;databaseName=Carepro_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    env: 'prod',
  }),
  pte: Object.freeze({
    baseUrl: process.env.PTE_BASE_URL || 'https://ptecarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://ptecarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'pt-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://ptcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://PTSQLCORE.specialtycare.corp.evolenthealth.com:1433;databaseName=Carepro_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    env: 'pte',
  }),
  shqa: Object.freeze({
    baseUrl: process.env.SHQA_BASE_URL || 'https://qa1carepro.evolent.com/',
    appUrl: 'https://qa1carepro.evolent.com/',
    appcrmurl: 'qa-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://qacproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    intakeUMUser: 'svc_auto_ic2',
    intakeUMPassword: 'AutomationAug2026!',
    CRUMUser: 'svc_auto_cr2',
    CRUMPassword: 'AutomationAug2026!',
    FLRUMUser: 'svc_auto_flr2',
    FLRUMPassword: 'AutomationAug2026!',
    OfficeManagerUserName: 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: 'SvdV@o)U*s',
    ProviderUserName: 'svc_auto_provider2',
    ProviderPassword: 'AutomationAug2026!',
    PCPProviderUserName: 'svc_auto_pcpprovider2',
    PCPProviderPassword: '7&_C*tYc%}',
    PharmacyUser: 'svc_auto_rph2',
    PharmacyPassword: 'AutomationAug2026!',
    env: 'shqa',
  }),
  shqa2: Object.freeze({
    baseUrl: process.env.SHQA2_BASE_URL || 'https://qa2carepro.evolent.com/',
    appUrl: 'https://qa2carepro.evolent.com/',
    appcrmurl: 'qa-vm-cprocm-01.specialtycare.corp.evolenthealth.com/CareProQA2/',
    crmApiUrl: 'http://qa2cproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM2;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    env: 'shqa2',
  }),
  shdev: Object.freeze({
    baseUrl: process.env.SHDEV_BASE_URL || 'https://dvcarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://dvcarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'dv-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://dvcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://dvsqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    intakeUMUser: 'svc_auto_ic2',
    intakeUMPassword: 's&:Q^PL|p7',
    CRUMUser: 'svc_auto_cr2',
    CRUMPassword: 'L(EwohIWFA',
    FLRUMUser: 'svc_auto_flr2',
    FLRUMPassword: 'x#AP>o7RYd',
    OfficeManagerUserName: 'svc_auto_Ofcmgr2',
    OfficeManagerPassword: 'rLPYK8xBTq',
    ProviderUserName: 'svc_auto_provider2',
    ProviderPassword: 'HVuVLd%U%k',
    PCPProviderUserName: 'svc_auto_pcpprovider2',
    PCPProviderPassword: '-q_9#UT@rA',
    PharmacyUser: 'svc_auto_rph2',
    PharmacyPassword: 'xv}.rYs!hq',
    env: 'shdev',
  }),
  ut: Object.freeze({
    baseUrl: process.env.UT_BASE_URL || 'https://utcarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://utcarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'ut-vm-cprocm-01.specialtycare.corp.evolenthealth.com/',
    crmApiUrl: 'http://utcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://utsqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    env: 'ut',
  }),
  ct: Object.freeze({
    baseUrl: process.env.CT_BASE_URL || 'https://clcarepro.specialtycare.corp.evolenthealth.com/',
    appUrl: 'https://clcarepro.specialtycare.corp.evolenthealth.com/',
    appcrmurl: 'http://tr-vm-cprocm-11.specialtycare.corp.evolenthealth.com/careprocl/main.aspx/',
    crmApiUrl: 'http://clcproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.AuthorizationRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://clsqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=Carepro_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    env: 'ct',
  }),
  data: Object.freeze({
    baseUrl: process.env.DATA_BASE_URL || 'https://qa-my.newcenturyhealth.com/',
    appUrl: 'https://qa-my.newcenturyhealth.com/',
    crmApiUrl: 'http://qaappintvip0.headquarters.newcenturyhealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.headquarters.newcenturyhealth.com:1433;databaseName=NCH_QA_MSCRM;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    careProPlusApiKey: '56056_eb23227861a7d187438fbaa2a53b7ea80ba0a13d7719f09b63964f661e369f61',
    careProPlusBaseUrl: 'https://qaapp_careproplusvip.newcenturyhealth.com',
    env: 'data',
  }),
  uat: Object.freeze({
    baseUrl: process.env.UAT_BASE_URL || '',
    appUrl: '',
    appcrmurl: '',
    crmApiUrl: '',
    dbConfig: {
      url: '',
      username: '__DbUATUser__',
      password: '__DbUATPwd__',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    env: 'uat',
  }),
});

const normalizedEnvironmentName = (process.env.TEST_ENV || 'shqa').toLowerCase();
const environmentKey = normalizedEnvironmentName as keyof typeof environments;
const credentials = environments[environmentKey] ?? {
  baseUrl: process.env.SHQA_BASE_URL || 'https://qa1carepro.evolent.com/',
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

export async function resolveLoggedInUserLabelName(loginName?: string): Promise<string | undefined> {
  if (!loginName || !hasRealCredential(loginName)) {
    return undefined;
  }

  const server = process.env.SQL_SERVER || process.env.DB_SERVER;
  const database = process.env.SQL_DATABASE || process.env.DB_NAME;
  const user = process.env.SQL_USER || process.env.DB_USER;
  const password = process.env.SQL_PASSWORD || process.env.DB_PASSWORD;
  const port = Number(process.env.SQL_PORT || process.env.DB_PORT || 1433);

  if (!server || !database || !user || !password) {
    return undefined;
  }

  try {
    const sql = await import('mssql');
    const pool = await sql.default.connect({
      server,
      database,
      user,
      password,
      port,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    });

    const query = `
      declare @currentdate datetime
      set @currentdate = GETUTCDATE()
      select top 1
        c.carepro_PortalLogin as LoginCredentialName,
        c.fullname,
        cpu.carepro_ContactIdName as LoggedInUserLableName,
        carepro_portalprofileroleidname as PortalName,
        carepro_MFACode as MFACode,
        carepro_MFAStartDate as MFAStartDate,
        carepro_InvalidMFAAttempts
      from Contactbase c
      left join carepro_portaluser cpu with (nolock)
        on (c.ContactId = cpu.carepro_ContactId)
      where cpu.carepro_EffectiveFrom <= @currentdate
        and cpu.carepro_EffectiveTo >= @currentdate
        and c.carepro_PortalLogin = '${String(loginName).replace(/'/g, "''")}'`;

    const result = await pool.request().query(query);
    const label = result.recordset?.[0]?.LoggedInUserLableName as string | undefined;
    await pool.close();
    return label;
  } catch (error) {
    console.warn('Unable to resolve logged-in user display name from SQL:', error);
    return undefined;
  }
}

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

export const connection = Object.freeze({
  ...credentials,
  username: envCreds.intakeUMUser || envCreds.username || '',
  password: envCreds.intakeUMPassword || envCreds.password || '',
  users,
  url: (path = '/') => new URL(path, credentials.baseUrl).toString(),
});
