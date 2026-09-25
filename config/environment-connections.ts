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

export const environmentConnections: Record<string, EnvironmentConnection> = Object.freeze({
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
  }),
  shqa2: Object.freeze({
    appUrl: 'https://qa2carepro.evolent.com/',
    appcrmurl: 'qa-vm-cprocm-01.specialtycare.corp.evolenthealth.com/CareProQA2/',
    crmApiUrl: 'http://qa2cproapp.specialtycare.corp.evolenthealth.com/CarePro.Services.CRM.ServiceRequestService.svc',
    dbConfig: {
      url: 'jdbc:sqlserver://qasqlcore.specialtycare.corp.evolenthealth.com:1433;databaseName=NCH_QA_MSCRM2;integratedSecurity=false;encrypt=true;trustServerCertificate=true',
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
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
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
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
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
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
      username: 'CareProPortalReader',
      password: 'h8tUVpul2#z8',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
  data: Object.freeze({
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
  }),
  uat: Object.freeze({
    appUrl: '',
    appcrmurl: '',
    crmApiUrl: '',
    dbConfig: {
      url: '',
      username: '__DbUATUser__',
      password: '__DbUATPwd__',
      driverClassName: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
  }),
});

export const environmentName = (process.env.TEST_ENV || 'shqa').toLowerCase();
const selectedConnection = environmentConnections[environmentName] ?? environmentConnections.shqa;

if (!selectedConnection) {
  throw new Error(
    `Unsupported TEST_ENV "${environmentName}". Available environments: ${Object.keys(environmentConnections).join(', ')}`,
  );
}

export const connection = Object.freeze({
  ...selectedConnection,
  url: (path = '/') => new URL(path, selectedConnection.baseUrl || '').toString(),
});
