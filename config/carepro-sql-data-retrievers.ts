import { hasRealCredential } from './carepro-environments-account-credentials';
import { environmentConnections } from './carepro-environments-connectionstrings';

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

    const query = getSqlQuery('get_common_login_user_data', { LOGINNAME: loginName });
    const result = await pool.request().query(query);
    const label = result.recordset?.[0]?.LoggedInUserLableName as string | undefined;
    await pool.close();
    return label;
  } catch (error) {
    console.warn('Unable to resolve logged-in user display name from SQL:', error);
    return undefined;
  }
}

export const sqlQueries = Object.freeze({
  get_common_login_user_data: `
    declare @currentdate datetime
    set @currentdate = GETUTCDATE()
    select top 1 c.carepro_PortalLogin as LoginCredentialName, c.fullname,
      cpu.carepro_ContactIdName as LoggedInUserLableName,
      carepro_portalprofileroleidname as PortalName, carepro_MFACode as MFACode,
      carepro_MFAStartDate as MFAStartDate, carepro_InvalidMFAAttempts
    from Contactbase c
    left join carepro_portaluser cpu with (nolock) on c.ContactId = cpu.carepro_ContactId
    where cpu.carepro_EffectiveFrom <= @currentdate
      and cpu.carepro_EffectiveTo >= @currentdate
      and c.carepro_PortalLogin = '<LOGINNAME>'`,
  get_common_authReq_notification_status: `
    select top 1 ar.carepro_name as AuthRequestId, pn.carepro_AuthRequestIdName,
      carepro_IsNotificationDocumentGenerated as NotificationGenerated, ar.CreatedOn,
      pn.CreatedOn, ar.statuscode
    from carepro_authrequest ar
    left join carepro_patientnotification pn on ar.carepro_name = pn.carepro_authrequestidname
    left join carepro_authrequestalert aa on ar.carepro_authrequestId = aa.carepro_AuthRequestId
    where ar.carepro_name = '<REFNUM>'`,
  get_common_rad_auth_document_creation_status: `
    select ar.carepro_name as AuthRequestId, ar.CreatedOn as AuthCreatedTime,
      d.CreatedOn as DocumentCreatedTime, ar.statuscode,
      case when d.carepro_name is null then 0 else 1 end as RADDocumentGenerated
    from carepro_authrequestbase ar with (nolock)
    left join carepro_documentbase d on ar.carepro_name = d.carepro_containerfolders
    where ar.carepro_name = '<REFNUM>' and d.carepro_name like '%RAD.pdf%'
      and d.carepro_IsLatestVersion = 1`,
  get_common_provider_practice_fax_phone: `
    select top 1 cb.FullName as ProviderName, ab.[name] as PracticeName,
      ISNULL(ISNULL(REPLACE(carepro_PracticePhone, '-', ''), REPLACE(ab.Telephone1, '-', '')), '') as PracticePhone,
      ISNULL(ISNULL(REPLACE(carepro_PracticeFax, '-', ''), REPLACE(ab.Fax, '-', '')), '') as PracticeFax,
      ISNULL(ISNULL(REPLACE(carepro_SubmittedByPhone, '-', ''), REPLACE(cb.Telephone1, '-', '')), '') as SubmittedByPhone,
      ISNULL(ISNULL(REPLACE(carepro_SubmittedByFax, '-', ''), REPLACE(cb.Fax, '-', '')), '') as SubmittedByFax,
      arb.modifiedon as AuthRequestModifiedOn, srb.modifiedon as ServiceRequestModifiedOn,
      ab.Telephone1 as SourcePracticePhone, ab.Fax as SourcePracticeFax,
      cb.Telephone1 as SourceSubmittedByPhone, cb.Fax as SourceSubmittedByPhone,
      carepro_PracticePhone as TransactPracticePhone, carepro_PracticeFax as TransactPracticeFax,
      carepro_SubmittedByPhone as TransactSubmittedByPhone, carepro_SubmittedByFax as TransactSubmittedByFax
    from Carepro_ServiceRequestBase srb with (nolock)
    left join carepro_authrequestBase arb with (nolock)
      on srb.carepro_servicerequestId = arb.carepro_OriginatingServiceRequestId
      and arb.ModifiedOn >= '10/15/2024'
    join AccountBase ab with (nolock) on srb.carepro_PracticeLocationId = ab.AccountId
    join Contactbase cb with (nolock) on srb.carepro_SubmittedById = cb.ContactId
    where cb.FullName = '<ProviderName>' and ab.[name] = '<PracticeName>'
    order by arb.modifiedon desc`,
  get_common_active_auth_member_data: `
    select distinct top (1) ar.carepro_name as AuthId, carepro_MemberID as MemberID,
      ar.statuscode as AuthStatus
    from carepro_authrequestbase ar with (nolock)
    join carepro_patientbase pb with (nolock) on ar.carepro_PatientId = pb.carepro_patientId
    join carepro_authrequestalert aa with (nolock) on ar.carepro_authrequestId = aa.carepro_AuthRequestId
    where ar.statuscode = '725060008' order by AuthId desc`,
  get_common_search_auth_via_createduser: `
    declare @cleanfromlastndays int, @loginname varchar(max)
    set @loginname = '<LOGINNAME>'
    set @cleanfromlastndays = '<CLEANFORNDAYS>'
    select ar.carepro_name as AuthName, cb.FullName as LoginLabelName,
      cb.carepro_PortalLogin as LoggedInUserName, cb2.FullName as SubmittedUserName,
      ar.statuscode, ar.CreatedOn, sr.CreatedOn,
      ROW_NUMBER() over (order by ar.carepro_name desc) as TotalAuths,
      ar.carepro_CreatedByContactId, sr.carepro_CreatedByContactId,
      carepro_SubmittedById, carepro_LineofService
    from dbo.carepro_authrequestBase ar with (nolock)
    join dbo.carepro_servicerequestBase sr with (nolock)
      on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
    join contactbase cb with (nolock) on sr.carepro_CreatedByContactId = cb.ContactId
    join contactbase cb2 with (nolock) on sr.carepro_SubmittedById = cb2.ContactId
    where cb.carepro_PortalLogin = @loginname
      and ar.CreatedOn >= getutcdate() - @cleanfromlastndays
      and sr.CreatedOn >= getutcdate() - @cleanfromlastndays
      and ar.statuscode not in ('725060042', '725060025', '725060038')
    order by case when ar.statuscode = '725060004' then 1 else 0 end, ar.CreatedOn desc`,
  get_common_numberof_active_auths_vialoginuser: `
    declare @loginname varchar(max), @cleanfromlastndays int
    set @loginname = '<LOGINNAME>'
    set @cleanfromlastndays = '<CLEANFORNDAYS>'
    select ISNULL(count(TotalAuths), 0) as NumberofAuthsActive
    from (
      select top 10000 ar.carepro_name as AuthName,
        cb.carepro_PortalLogin as LoggedInUserName, ar.statuscode,
        ROW_NUMBER() over (order by ar.carepro_name desc) as TotalAuths
      from dbo.carepro_authrequestBase ar with (nolock)
      join dbo.carepro_servicerequestBase sr with (nolock)
        on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
      join contactbase cb with (nolock) on sr.carepro_CreatedByContactId = cb.ContactId
      where cb.carepro_PortalLogin = @loginname
        and ar.CreatedOn >= getutcdate() - @cleanfromlastndays
        and sr.CreatedOn >= getutcdate() - @cleanfromlastndays
        and ar.statuscode not in ('725060042', '725060025', '725060038')
      order by ar.CreatedOn asc
    ) a`,
  get_common_servicing_provider_practice_phone_fax: `
    declare @servicePracticename varchar(max) = '<SERVICINGPRACTICENAME>',
      @serviceProvidername varchar(max) = '<SERVICINGPROVIDERNAME>',
      @serviceNetworkName varchar(max) = '<SERVICINGPROVIDERNETWORK>',
      @intakePhoneFaxGoLiveDate datetime = '10/15/2024', @getdate datetime = GETUTCDATE()
    select top 1 PracticeSourcePhone, PracticeSourceFax, ServicingAuthPracticePhone,
      ServicingAuthPracticeFax,
      REPLACE(ISNULL(ServicingAuthPracticePhone, PracticeSourcePhone), '-', '') as UIServicingPracticePhone,
      REPLACE(ISNULL(ServicingAuthPracticeFax, PracticeSourceFax), '-', '') as UIServicingPracticeFax
    from (
      select top 1 carepro_ServiceProviderPracticePhone as ServicingAuthPracticePhone,
        carepro_ServiceProviderPracticeFax as ServicingAuthPracticeFax, ab.accountid
      from dbo.carepro_authrequestBase ar with (nolock)
      join dbo.carepro_servicerequestBase sr with (nolock)
        on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
      join ContactBase cb with (nolock) on sr.carepro_ServiceProviderId = cb.ContactId
      join AccountBase ab with (nolock) on sr.carepro_ServicingProviderPracticeLocationId = ab.AccountId
      where cb.FullName = @serviceProvidername and ab.[Name] = @servicePracticename
        and ar.ModifiedOn >= @intakePhoneFaxGoLiveDate
      order by ar.ModifiedOn desc
    ) A right join (
      select distinct ISNULL(act.Telephone1, '') as PracticeSourcePhone,
        ISNULL(act.Fax, '') as PracticeSourceFax, act.AccountId
      from Contactbase c
      join carepro_affiliationbase cab on c.contactid = cab.carepro_providerid
      join accountbase act on cab.carepro_PracticeId = act.AccountId
      join carepro_networkbase cn on cab.carepro_NetworkId = cn.carepro_networkId
      where fullname = @serviceProvidername and act.[name] = @servicePracticename
        and cn.carepro_name = @serviceNetworkName
        and cab.carepro_EffectiveFrom <= @getdate and cab.carepro_EffectiveTo >= @getdate
    ) b on A.AccountId = b.AccountId`,
  get_common_siteofservice_practice_phone_fax: `
    declare @FacilityPracticename varchar(max) = '<FACILITYNAME>',
      @FacilityTIN varchar(max) = '<FACILITYTIN>', @FacilityNPI varchar(max) = '<FACILITYNPI>',
      @siteOfServiceType int = '<SERVICETYPE>', @intakePhoneFaxGoLiveDate datetime = '10/15/2024'
    select top 1 SiteOfServicePracticeSourcePhone, SiteOfServicePracticeSourceFax,
      SiteOfServiceAuthPhone, SiteOfServiceAuthFax,
      REPLACE(ISNULL(SiteOfServiceAuthPhone, SiteOfServicePracticeSourcePhone), '-', '') as UISiteOfServicePracticePhone,
      REPLACE(ISNULL(SiteOfServiceAuthFax, SiteOfServicePracticeSourceFax), '-', '') as UISiteOfServicePracticeFax
    from (
      select top 1 ISNULL(ci.carepro_SiteofServicePhone, '') as SiteOfServiceAuthPhone,
        ISNULL(ci.carepro_SiteofServiceFax, '') as SiteOfServiceAuthFax, 1 as ROWNUM
      from dbo.carepro_authrequestBase ar with (nolock)
      join dbo.carepro_servicerequestBase sr with (nolock)
        on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
      join carepro_clinicalinformationBase ci with (nolock)
        on sr.carepro_servicerequestId = ci.carepro_ServiceRequestId
      join AccountBase acb on ci.carepro_Siteid = acb.AccountId
      where ci.carepro_SiteofServiceTypeForSearch = @siteOfServiceType
        and ar.ModifiedOn >= @intakePhoneFaxGoLiveDate
        and acb.[Name] = @FacilityPracticename and acb.carepro_TaxID = @FacilityTIN
        and acb.carepro_npi = @FacilityNPI order by ar.ModifiedOn desc
    ) aa right join (
      select distinct ISNULL(ab.Telephone1, '') as SiteOfServicePracticeSourcePhone,
        ISNULL(ab.Fax, '') as SiteOfServicePracticeSourceFax, 1 as ROWNUM
      from AccountBase ab where ab.[Name] = @FacilityPracticename
        and ab.carepro_TaxID = @FacilityTIN and ab.carepro_npi = @FacilityNPI
    ) bb on aa.ROWNUM = bb.ROWNUM`,
  get_common_requesting_provider_phone_fax: `
    declare @RequestingPracticename varchar(max) = '<REQUESTINGPRACTICENAME>',
      @RequestingProvidername varchar(max) = '<REQUESTINGPROVIDERNAME>',
      @ProviderNPI varchar(max) = '<ProviderNPI>', @intakePhoneFaxGoLiveDate datetime = '10/15/2024'
    select top 1 RequestingProviderSourcePhone, RequestingProviderSourceFax,
      RequestingProviderAuthPhone, RequestingProviderAuthFax,
      REPLACE(ISNULL(RequestingProviderAuthPhone, RequestingProviderSourcePhone), '-', '') as RequestingProviderUIPhone,
      REPLACE(ISNULL(RequestingProviderAuthFax, RequestingProviderSourceFax), '-', '') as RequestingProviderUIFax
    from (
      select top 1 carepro_SubmittedByPhone as RequestingProviderAuthPhone,
        carepro_SubmittedByFax as RequestingProviderAuthFax, carepro_submittedbyid
      from dbo.carepro_authrequestBase ar with (nolock)
      join dbo.carepro_servicerequestBase sr with (nolock)
        on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
      join ContactBase cb with (nolock) on sr.carepro_SubmittedById = cb.ContactId
      join AccountBase ab with (nolock) on sr.carepro_PracticeLocationId = ab.AccountId
      where cb.FullName = @RequestingProvidername and ab.[Name] = @RequestingPracticename
        and ar.ModifiedOn >= @intakePhoneFaxGoLiveDate order by ar.ModifiedOn desc
    ) A right join (
      select distinct ISNULL(Telephone1, '') as RequestingProviderSourcePhone,
        ISNULL(Fax, '') as RequestingProviderSourceFax, contactid
      from contactbase where FullName = @RequestingProvidername and carepro_npi = @ProviderNPI
    ) bb on A.carepro_SubmittedById = bb.contactid`,
  get_common_pp_prior_auth_contact_phone_fax: `
    select top 1 RequestingProviderSourcePhone, RequestingProviderSourceFax,
      RequestingProviderAuthPhone, RequestingProviderAuthFax,
      REPLACE(ISNULL(RequestingProviderAuthPhone, RequestingProviderSourcePhone), '-', '') as RequestingProviderUIPhone,
      REPLACE(ISNULL(RequestingProviderAuthFax, RequestingProviderSourceFax), '-', '') as RequestingProviderUIFax
    from (
      select top 1 carepro_SubmittedByPhone as RequestingProviderAuthPhone,
        carepro_SubmittedByFax as RequestingProviderAuthFax, carepro_submittedbyid
      from dbo.carepro_authrequestBase ar with (nolock)
      join dbo.carepro_servicerequestBase sr with (nolock)
        on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
      join ContactBase cb with (nolock) on sr.carepro_SubmittedById = cb.ContactId
      join AccountBase ab with (nolock) on sr.carepro_PracticeLocationId = ab.AccountId
      where cb.FullName = '<REQUESTINGPROVIDERNAME>' and ab.[Name] = '<REQUESTINGPRACTICENAME>'
        and ar.ModifiedOn >= '10/15/2024' order by ar.ModifiedOn desc
    ) A right join (
      select distinct ISNULL(Telephone1, '') as RequestingProviderSourcePhone,
        ISNULL(Fax, '') as RequestingProviderSourceFax, contactid
      from contactbase where FullName = '<REQUESTINGPROVIDERNAME>'
    ) bb on A.carepro_SubmittedById = bb.contactid`,
  get_common_pp_requesting_practice_phone_fax: `
    declare @RequestingPracticename varchar(max) = '<REQUESTINGPRACTICENAME>',
      @RequestingNetworkName varchar(max) = '<REQUESTINGNETWORKNAME>',
      @RequestingProvidername varchar(max) = '<REQUESTINGPROVIDERNAME>',
      @intakePhoneFaxGoLiveDate datetime = '10/15/2024', @getdate datetime = GETUTCDATE()
    select top 1 RequestingPracticeSourcePhone, RequestingPracticeSourceFax,
      RequestingPracticeAuthPhone, RequestingPracticeAuthFax,
      REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(RequestingPracticeAuthPhone, RequestingPracticeSourcePhone), '-', ''), '(', ''), ')', ''), ' ', '') as RequestingPracticeUIPhone,
      REPLACE(ISNULL(RequestingPracticeAuthFax, RequestingPracticeSourceFax), '-', '') as RequestingPracticeUIFax
    from carepro_authrequestBase ar with (nolock)
    join carepro_servicerequestBase sr with (nolock)
      on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
    join ContactBase cb with (nolock) on sr.carepro_SubmittedById = cb.ContactId
    join AccountBase ab with (nolock) on sr.carepro_PracticeLocationId = ab.AccountId
    where cb.FullName = @RequestingProvidername and ab.[Name] = @RequestingPracticename
      and ar.ModifiedOn >= @intakePhoneFaxGoLiveDate order by ar.ModifiedOn desc`,
  get_common_requesting_practice_phone_fax: `
    declare @RequestingPracticename varchar(max) = '<REQUESTINGPRACTICENAME>',
      @RequestingNetworkName varchar(max) = '<REQUESTINGNETWORKNAME>',
      @RequestingProvidername varchar(max) = '<REQUESTINGPROVIDERNAME>',
      @intakePhoneFaxGoLiveDate datetime = '10/15/2024', @getdate datetime = GETUTCDATE()
    select top 1 RequestingPracticeSourcePhone, RequestingPracticeSourceFax,
      RequestingPracticeAuthPhone, RequestingPracticeAuthFax,
      REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(RequestingPracticeAuthPhone, RequestingPracticeSourcePhone), '-', ''), '(', ''), ')', ''), ' ', '') as RequestingPracticeUIPhone,
      REPLACE(ISNULL(RequestingPracticeAuthFax, RequestingPracticeSourceFax), '-', '') as RequestingPracticeUIFax
    from (
      select top 1 carepro_PracticePhone as RequestingPracticeAuthPhone,
        carepro_PracticeFax as RequestingPracticeAuthFax, AccountId
      from dbo.carepro_authrequestBase ar with (nolock)
      join dbo.carepro_servicerequestBase sr with (nolock)
        on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
      join ContactBase cb with (nolock) on sr.carepro_SubmittedById = cb.ContactId
      join AccountBase ab with (nolock) on sr.carepro_PracticeLocationId = ab.AccountId
      where cb.FullName = @RequestingProvidername and ab.[Name] = @RequestingPracticename
        and ar.ModifiedOn >= @intakePhoneFaxGoLiveDate order by ar.ModifiedOn desc
    ) A right join (
      select distinct ISNULL(act.Telephone1, '') as RequestingPracticeSourcePhone,
        ISNULL(act.Fax, '') as RequestingPracticeSourceFax, act.AccountId
      from Contactbase c
      join carepro_affiliationbase cab on c.contactid = cab.carepro_providerid
      join accountbase act on cab.carepro_PracticeId = act.AccountId
      join carepro_networkbase cn on cab.carepro_NetworkId = cn.carepro_networkId
      where fullname = @RequestingProvidername and act.[name] = @RequestingPracticename
        and cn.carepro_name = @RequestingNetworkName
        and cab.carepro_EffectiveFrom <= @getdate and cab.carepro_EffectiveTo >= @getdate
    ) b on A.AccountId = b.AccountId`,
  get_commmon_retrodayslimit_network: `
    declare @getdatetime datetime = GETDATE()
    select distinct carepro_retrodayslimit as RetroLimitDays, ssb.carepro_name as RetroName,
      pb.carepro_name as Payer, sb.carepro_name as Specialty, nb.carepro_name as Network,
      CONVERT(varchar(10), DATEADD(day, -carepro_retrodayslimit, @getdatetime), 101) as RetroLimitDate,
      CONVERT(varchar(10), DATEADD(day, -carepro_retrodayslimit - 1, @getdatetime), 101) as RetroLimitDatePreviousDay,
      CONVERT(varchar(10), @getdatetime, 101) as ServerCurrentDate
    from carepro_supportedscopeBase ssb
    join carepro_payerBase pb with (nolock) on ssb.carepro_PayerId = pb.carepro_payerId
    join carepro_specialtyBase sb with (nolock) on ssb.carepro_specialtyid = sb.carepro_specialtyid
    join carepro_networkBase nb with (nolock) on ssb.carepro_networkid = nb.carepro_networkid
    where ssb.carepro_EffectiveFrom <= @getdatetime and ssb.carepro_EffectiveTo >= @getdatetime
      and sb.carepro_name = '<SPECIALTY>' and pb.carepro_name = '<PAYER>' and nb.carepro_name = '<NETWORK>'`,
  get_common_validate_retro_standard: `
    declare @getdatetime datetime = GETUTCDATE()
    select distinct ab.carepro_name as AuthID, carepro_retrodayslimit, carepro_TreatmentStartDate,
      case when carepro_retrodayslimit is null or carepro_retrodayslimit = 0
        or carepro_TreatmentStartDate >= sr.carepro_SubmittedOnDate then 'Standard'
        when DATEDIFF(day, ab.carepro_TreatmentStartDate, sr.carepro_SubmittedOnDate) <= carepro_retrodayslimit then 'Retro' end as RequestPriorityCalculatedValue,
      case when ab.carepro_RequestType = 725060000 then 'Standard'
        when ab.carepro_RequestType = 725060001 then 'Retro'
        when ab.carepro_RequestType = 725060002 then 'EXPEDITED' end as AuthRequestPriorityDBValue
    from carepro_authrequestbase ab with (nolock)
    left join dbo.carepro_servicerequestBase sr with (nolock)
      on sr.carepro_servicerequestId = ab.carepro_OriginatingServiceRequestId
    where ab.carepro_name = '<AUTHID>'`,
  get_common_auth_notification_documents: `
    select distinct ar.carepro_name as AuthRequestId, pn.carepro_AuthRequestIdName,
      carepro_EndtoEndDueBy, carepro_CompletionDate, carepro_MetSLA,
      carepro_IsNotificationDocumentGenerated as NotificationGenerated, ar.CreatedOn,
      d.CreatedOn, ar.statuscode, sg.carepro_ImageType, sg.carepro_name as statusGrpName,
      ar.CreatedBy, ar.CreatedByName, d.carepro_name
    from carepro_authrequest ar
    left join carepro_patientnotification pn on ar.carepro_authrequestId = pn.carepro_AuthRequestId
    left join carepro_authrequestalertBase aa on ar.carepro_authrequestId = aa.carepro_AuthRequestId
    left join carepro_statusgroupBase sg on ar.statuscode = sg.carepro_ImageType
    left join carepro_documentbase d on ar.carepro_name = d.carepro_containerfolders
    where ar.carepro_name = '<AUTHNUM>' and d.carepro_name not like '%CTR.pdf' and d.carepro_name not like '%MRA.pdf'`,
  get_common_auth_notification_outcomes: `
    select distinct ar.carepro_name as AuthRequest, rr.carepro_name as ReferralRequest,
      ar.statuscode as AuthStatus, rr.statuscode as ReferralStatus, f.carepro_Attempts,
      f.carepro_HasRerun, f.carepro_RemoveFromFailedFaxDashboard, f.carepro_serviceproviderfaxid,
      carepro_ServiceProviderFaxStatus, cp.carepro_notificationtype, carepro_NotificationStatus,
      ns.carepro_ActionOutcome, f.createdon, f.[subject], f.carepro_parentfaxid, f.ActivityId,
      lb.carepro_LetterReceived, lb.carepro_RecipientType, ns.carepro_NotificationDateTime,
      ns.carepro_RecipientType, f.modifiedon
    from fax f with (nolock)
    left join dbo.ActivityPointerBase a with (nolock) on a.ActivityId = f.ActivityId
    right join carepro_authrequest ar with (nolock) on ar.carepro_authrequestid = a.regardingobjectid
    left join carepro_referralrequest rr with (nolock) on rr.carepro_referralrequestid = a.regardingobjectid
    left join LetterBase lb with (nolock) on a.ActivityId = lb.ActivityId
    left join PhoneCallBase pcb with (nolock) on a.ActivityId = pcb.ActivityId
    left join carepro_patientnotification cp with (nolock) on ar.carepro_authrequestId = cp.carepro_AuthRequestId
    left join carepro_notificationstatus ns with (nolock) on cp.carepro_patientnotificationid = ns.carepro_patientnotificationid
    where ar.carepro_name = '<AUTHID>'`,
  get_AADSS_auth_status_message: `
    select *, ab.carepro_name, ab.carepro_IsApprovedByAADSS, al.carepro_Message,
      al.carepro_AuthRequestIdName
    from dbo.carepro_authrequestBase ab
    inner join dbo.carepro_authrequestLog al on ab.carepro_name = al.carepro_AuthRequestIdName
    where al.carepro_message like '%AADSS %' and ab.carepro_name in ('<AUTHNUM>')
    order by ab.CreatedOn desc`,
  get_common_user_profile_rolearea: `
    declare @currentdate datetime = GETUTCDATE()
    select distinct c.carepro_PortalLogin, pu.carepro_contactidname,
      pu.carepro_portalprofileroleidname, pu.createdbyname, pprb.carepro_name,
      pprb.carepro_Description, pprb.carepro_UseAffiliation,
      pprb.carepro_AuthenticationClaimRoleType, pprab.carepro_name,
      pprab.carepro_CanAccessUSRestricted, pprab.carepro_NotMenuItem,
      pprab.carepro_UIViewPath, pprab.carepro_portalprofileroleareaId,
      pu.carepro_effectivefrom, pu.carepro_effectiveto, sub.FullName, sub.DomainName
    from contactbase c
    join carepro_portaluser pu on c.ContactId = pu.carepro_ContactId
    join carepro_portalprofileroleBase pprb on pu.carepro_portalprofileroleid = pprb.carepro_portalprofileroleid
    join carepro_portalprofileroleareabase pprab on pprb.carepro_portalprofileroleid = pprab.carepro_portalprofileroleid
    left join SystemUserBase sub on c.carepro_SystemUserId = sub.SystemUserId
    where carepro_PortalLogin = '<LOGINNAME>'
      and pu.carepro_EffectiveFrom <= @currentdate and pu.carepro_EffectiveTo >= @currentdate`,
  get_common_auth_status_sla_dueby: `
    select distinct ar.carepro_name as AuthRequest,
      case when ar.statuscode = '725060008' then 'PENDING REVIEW'
        when ar.statuscode = '725060000' then 'Medication Request Finalized and Faxed'
        when ar.statuscode = '725060042' then 'Voided By CleanUp Endpoint' end as AuthUIStatus,
      ar.statuscode, ar.CreatedOn, carepro_CompletionDate, carepro_MetSLA,
      carepro_EndtoEndDueBy, ar.carepro_dueby, ar.carepro_dueby as DueBy_DatabaseUTCValue,
      getutcdate() as ServerCurrentdateTime
    from carepro_authrequest ar with (nolock)
    join dbo.carepro_servicerequestBase sr with (nolock)
      on sr.carepro_servicerequestId = ar.carepro_OriginatingServiceRequestId
    where ar.carepro_name = '<AUTHNUM>'`,
  get_common_pp_referral_cleanup: `
    declare @cleanfromlastndays int = 60
    select distinct rrb.carepro_name as AuthName, cb.FullName as LoginLabelName,
      cb.carepro_PortalLogin as LoggedInUserName, rrb.carepro_Status,
      ofrb.carepro_SubmittedOn, rrb.CreatedBy, rrb.CreatedOn, rrb.carepro_IsAutoApproved
    from dbo.carepro_referralrequestBase rrb with (nolock)
    join carepro_originalreferralrequestBase ofrb
      on rrb.carepro_OriginalReferralRequestId = ofrb.carepro_originalreferralrequestId
    join contactbase cb with (nolock) on ofrb.carepro_SubmittedById = cb.ContactId
    where cb.carepro_PortalLogin in ('svc_auto_provider1', 'svc_auto_pcpprovider1', 'svc_auto_pcpprovider2', 'svc_auto_Ofcmgr2')
      and rrb.CreatedOn >= getutcdate() - @cleanfromlastndays and rrb.carepro_Status not in ('725060001')
    order by rrb.CreatedOn desc`,
  get_common_um_referral_cleanup: `
    declare @cleanfromlastndays int = 60
    select distinct rrb.carepro_name as AuthName, cb.FullName as LoginLabelName,
      cb.carepro_PortalLogin as LoggedInUserName, rrb.carepro_Status,
      ofrb.carepro_SubmittedOn, rrb.CreatedBy, rrb.CreatedOn, rrb.carepro_IsAutoApproved
    from dbo.carepro_referralrequestBase rrb with (nolock)
    join carepro_originalreferralrequestBase ofrb
      on rrb.carepro_OriginalReferralRequestId = ofrb.carepro_originalreferralrequestId
    join contactbase cb with (nolock) on ofrb.carepro_SubmittedById = cb.ContactId
    where cb.carepro_PortalLogin in ('nnsathappantest0', 'jgrant', 'pcpprovider')
      and rrb.CreatedOn >= getutcdate() - @cleanfromlastndays and rrb.carepro_Status not in ('725060001')
    order by rrb.CreatedOn desc`,
  get_common_BSA_Calculation: `
    declare @height_feet decimal(18, 3), @height_inches decimal(18, 3), @weight_lbs decimal(18, 3)
    set @height_feet = '<FEET>'
    set @height_inches = '<INCHES>'
    set @weight_lbs = '<LBS>'
    select cast(round(sqrt((((@height_feet * 12 + @height_inches) * 2.54) * (@weight_lbs / 2.20462262)) / 3600.0), 2) as decimal(10, 2)) as BSAValue`,
  get_common_oncology_diagnosiscode_diseasecatgory_treatmenttype: `
    declare @getutcdate datetime = GETUTCDATE()
    select distinct icdb.carepro_name as DiagnosisCode, tmtb.carepro_name as TreatmentType,
      cb.carepro_name as DiseaseCategory
    from carepro_icdBase icdb
    join carepro_icdeffectiveBase icdeb on icdb.carepro_icdId = icdeb.carepro_ICDId
    join carepro_diagnosisclassificationBase dcb on icdeb.carepro_icdId = dcb.carepro_ICDId
    join carepro_classificationBase cb on dcb.carepro_ClassificationId = cb.carepro_ClassificationId
    join carepro_icdtriggerclassificationBase itcb on itcb.carepro_ClassificationId = cb.carepro_ClassificationId
    join carepro_icdtriggertreatmenttypeBase ittb on itcb.carepro_icdtriggerclassificationId = ittb.carepro_icdtriggerclassificationId
    join carepro_treatmentmedicationtypeBase tmtb on ittb.carepro_TreatmentMedicationTypeId = tmtb.carepro_treatmentmedicationtypeId
    join carepro_supportedscopeBase ssb on icdeb.carepro_SupportedScopeId = ssb.carepro_supportedscopeId
    join carepro_payerbase pb on ssb.carepro_payerid = pb.carepro_payerId
    join carepro_specialtyBase sb on ssb.carepro_SpecialtyId = sb.carepro_specialtyId
    where icdb.carepro_EffectiveFrom <= @getutcdate and icdb.carepro_Effectiveto >= @getutcdate
      and icdeb.carepro_EffectiveFrom <= @getutcdate and icdeb.carepro_Effectiveto >= @getutcdate
      and sb.carepro_name = '<SPECIALTY>' and pb.carepro_name = '<PAYERNAME>'
    order by icdb.carepro_name desc`,
  get_common_cardiology_procedure_diagnosiscode: `
    declare @getutcdate datetime = GETUTCDATE()
    select distinct pb.carepro_name as PrimaryServiceName, sb.carepro_name as SubSpecialtyName,
      sb2.carepro_name as SpecialtyName, prb.carepro_name as PayerName,
      nb.carepro_name as NetworkName, icdb.carepro_name as DiagnosisCode,
      pb.carepro_IsCovered as ISProcedureEligible, icdb.carepro_IsCovered as ISDiagnosisCodeEligible,
      carepro_IsSelectable
    from carepro_procedureBase pb
    join carepro_supportedscopeprocedureBase sspb on pb.carepro_procedureId = sspb.carepro_ProcedureId
    join carepro_specialtyprocedureBase spb on sspb.carepro_procedureId = spb.carepro_ProcedureId
    join carepro_specialtyBase sb on spb.carepro_SpecialtyId = sb.carepro_specialtyId
    join carepro_specialtyBase sb2 on sb.carepro_ParentSpecialtyId = sb2.carepro_specialtyId
    join carepro_supportedscopeBase ssb on sspb.carepro_SupportedScopeId = ssb.carepro_supportedscopeId
    join carepro_payerbase prb on ssb.carepro_payerid = prb.carepro_payerId
    join carepro_networkBase nb on nb.carepro_networkId = ssb.carepro_NetworkId
    join carepro_icdeffectiveBase icdeb on icdeb.carepro_SupportedScopeId = ssb.carepro_supportedscopeId
    join carepro_diagnosisclassificationBase dcb on icdeb.carepro_icdId = dcb.carepro_ICDId
    join carepro_classificationBase cb on dcb.carepro_ClassificationId = cb.carepro_ClassificationId
    join carepro_icdBase icdb on icdb.carepro_icdId = icdeb.carepro_ICDId
    where sb2.carepro_name = 'cardiology' and prb.carepro_name = '<PAYER>'`,
  get_common_member_provider_details: `
    declare @CurrentDate datetime = GETUTCDATE()
    declare @MemberCount int = TRY_CAST('<NUMBEROFMEMBERS>' as int)
    select top (@MemberCount) c.carepro_PortalLogin as LoginCredentialName,
      c.fullname, c.fullname as LoggedInUserLableName,
      carepro_portalprofileroleidname as PortalName, cc.carepro_npi as ProviderNPI,
      cc.fullname as ProviderFullName, n.carepro_name as NetworkName,
      prac.[name] as PracticeName, carepro_taxid as PracticeTIN,
      prb.carepro_name as PayerName, CONVERT(varchar(max), pb.carepro_MemberID) as PatientMemberID,
      CONVERT(varchar(max), pb.carepro_FirstName) as FirstName,
      CONVERT(varchar(max), pb.carepro_LastName) as LastName
    from carepro_affiliationbase cab with (nolock)
    inner join accountbase prac with (nolock) on cab.carepro_PracticeId = prac.accountid
    inner join Contactbase cc with (nolock) on cab.carepro_ProviderId = cc.ContactId
    inner join carepro_networkbase n with (nolock) on cab.carepro_NetworkId = n.carepro_networkId
    inner join carepro_payerBase prb with (nolock) on prb.carepro_payerid = '<PAYERID>'
    inner join carepro_patientBase pb with (nolock) on pb.carepro_patientId = '<PATIENTID>'
    cross join contactbase c
    where cab.carepro_EffectiveFrom <= @CurrentDate and cab.carepro_EffectiveTo >= @CurrentDate
      and c.carepro_PortalLogin = '<LOGGEDINUSER>' and prb.carepro_name = '<PAYER>'
      and n.carepro_name = '<NETWORKNAME>' and cc.fullname = '<PROVIDERNAME>'
    order by NEWID()`,
  get_common_ECOG: `
    select '0 - No Symptoms, fully active, able to work' as ECOG, 725060005 as OptionSetValue
    union all select '1 Symptomatic, but not spending extra time in bed. Able to do light work', 725060000
    union all select '2 - In bed less than 50% of the day, unable to work, but can take care of self.', 725060001
    union all select '3 - In bed more than 50% of the day, but not bedridden, limited self care', 725060002
    union all select '4 - Completely bedridden', 725060003
    union all select '5 - Patient Deceased', 725060004
    union all select 'Unknown', 725060006`,
  get_common_request_intakechannel: `
    select 725060000 as Value, 'Fax' as Name union all select 725060001, 'Phone'
    union all select 725060002, 'Portal' union all select 725060003, 'ExternalSystem'
    union all select 725060004, 'Email/Mail' union all select -1, 'NotDefined'`,
  get_common_request_primarycontact_title: `
    select 725060000 as Value, 'RN' as Name union all select 725060001, 'MD'
    union all select 725060002, 'Physician Assistant' union all select 725060003, 'Medical Assistant'
    union all select 725060004, 'Pharmacist' union all select 725060005, 'Office Staff'
    union all select 725060006, 'Office Manager' union all select 725060007, 'Billing personnel'
    union all select 725060008, 'Finance personnel' union all select 725060009, 'Claims personnel'
    union all select 725060010, 'Receptionist' union all select 725060012, 'Financial Counselor'
    union all select 725060011, 'Other' union all select -1, 'NotDefined'`,
  get_common_request_priority_type: `
    select 725060000 as Value, 'Standard' as Name union all select 725060001, 'Retro'
    union all select 725060002, 'EXPEDITED' union all select -1, 'NotDefined'`,
  get_common_specialty_types: `
    select 725060000 as Value, 'Oncology' as Name union all select 725060001, 'Cardiology'
    union all select 725060002, 'Radiation Oncology' union all select 725060003, 'Urology'
    union all select 725060004, 'Dermatology' union all select 725060005, 'Medical Oncology'
    union all select 725060006, 'Neuro Oncology' union all select 725060007, 'Gynecology Oncology'
    union all select 725060008, 'Imaging' union all select 725060009, 'Surgical Oncology'
    union all select -1, 'NotDefined'`,
  get_common_member_eligibility_types: `
    select 725060000 as EligibilityValue, 'Medicare' as EligibilityType
    union all select 725060001, 'Medicaid' union all select 725060002, 'Commercial'
    union all select 725060003, 'Commercial ASO' union all select 725060011, 'Commercial EPO'
    union all select 725060004, 'Commercial HMO' union all select 725060005, 'Commercial PPO'
    union all select 725060006, 'Exchange' union all select 725060007, 'Medicare HMO'
    union all select 725060008, 'Medicare PPO' union all select 725060009, 'Commercial POS'
    union all select 725060010, 'Medicare POS' union all select 725060012, 'Medicare HMO One'`,
});

export type SqlQueryName = keyof typeof sqlQueries;

export function getSqlQuery(
  queryName: SqlQueryName,
  parameters: Record<string, string | number> = {},
): string {
  return Object.entries(parameters).reduce<string>(
    (query, [parameterName, parameterValue]) =>
      query.split(`<${parameterName}>`).join(String(parameterValue).replace(/'/g, "''")),
    sqlQueries[queryName] as string,
  );
}
