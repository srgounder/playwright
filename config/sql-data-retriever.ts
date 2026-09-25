import { hasRealCredential } from './environment-credentials';
import { environmentConnections } from './environment-connections';

const shqaDbConfig = environmentConnections.shqa.dbConfig;
const shqaJdbcUrl = shqaDbConfig?.url || '';
const shqaJdbcParts = /^jdbc:sqlserver:\/\/([^:;]+)(?::(\d+))?/i.exec(shqaJdbcUrl);
const shqaDatabase = /(?:^|;)databaseName=([^;]+)/i.exec(shqaJdbcUrl)?.[1];

export async function resolveLoggedInUserLabelName(loginName?: string): Promise<string | undefined> {
  if (!loginName || !hasRealCredential(loginName)) {
    return undefined;
  }

  const server = shqaJdbcParts?.[1];
  const database = shqaDatabase;
  const user = shqaDbConfig?.username;
  const password = shqaDbConfig?.password;
  const port = Number(shqaJdbcParts?.[2] || 1433);

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
        and c.carepro_PortalLogin = @loginName`;

      const result = await pool.request().input('loginName', sql.default.NVarChar, loginName).query(query);
    const label = result.recordset?.[0]?.LoggedInUserLableName as string | undefined;
    await pool.close();
    return label;
  } catch (error) {
    console.warn('Unable to resolve logged-in user display name from SQL:', error);
    return undefined;
  }
}
