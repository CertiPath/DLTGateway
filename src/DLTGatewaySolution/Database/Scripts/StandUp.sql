﻿-- Server types
INSERT INTO ServerType (GUID, Name, DisplayName)
VALUES ('79327ABA-DA24-4D0D-B8FB-1164294C9D21', 'LINUX', 'Linux')

INSERT INTO ServerType (GUID, Name, DisplayName)
VALUES ('B2F3F4C5-4D2E-4ABD-A68F-935BBAF16958', 'WINDOWS', 'Windows')
GO

-- supported blockchain framework types
INSERT INTO BlockchainFramework ([GUID], Name, DisplayName, Deleted)
VALUES ('77FC57A8-08D3-4542-9700-0D3F3E01E628', 'HLF', 'Hyperledger Fabric', 0) 

INSERT INTO BlockchainFramework ([GUID], Name, DisplayName, Deleted)
VALUES ('69BEF4F9-0342-45B4-A557-4B4B74C5A471', 'ETH', 'Ethereum', 0) 
GO

-- log setting type

INSERT INTO SettingType ([GUID], Name, DisplayName, UserEditable, [Order])
VALUES ('8210870F-CCA3-4D15-8CA6-0F6CAA557F9A', 'LOG', 'Log', 1, 0)
GO

-- settings
INSERT INTO Setting ([GUID], Name, DisplayName, SettingTypeGUID, [Value], ValueType, ValueReference, TooltipText, [Order], UserEditable, [Required])
VALUES ('2A8286AB-56B4-414E-B47A-D0D9FA00D816', 'LOG_NAME', 'Name', '8210870F-CCA3-4D15-8CA6-0F6CAA557F9A',  'CertiPath Blockchain Gateway Service', 'string', '', '', 0, 1, 1)
GO
INSERT INTO Setting ([GUID], Name, DisplayName, SettingTypeGUID, [Value], ValueType, ValueReference, TooltipText, [Order], UserEditable, [Required])
VALUES ('1DDD3251-6A6A-4CFF-9B0C-D6C4E6A6C9C5', 'LOG_EVENTLOG', 'Event Log', '8210870F-CCA3-4D15-8CA6-0F6CAA557F9A',  'TRUE', 'bool', '', '', 1, 1, 1)
GO
INSERT INTO Setting ([GUID], Name, DisplayName, SettingTypeGUID, [Value], ValueType, ValueReference, TooltipText, [Order], UserEditable, [Required])
VALUES ('0C43DC91-62A0-4EE3-A266-4FEBFB9B4CA7', 'LOG_CONSOLELOG', 'Console Log', '8210870F-CCA3-4D15-8CA6-0F6CAA557F9A',  'TRUE', 'bool', '', '', 2, 1, 1)
GO
INSERT INTO Setting ([GUID], Name, DisplayName, SettingTypeGUID, [Value], ValueType, ValueReference, TooltipText, [Order], UserEditable, [Required])
VALUES ('579AC584-09F2-4C47-90AE-895284FE2E8A', 'LOG_INFO', 'Log Info', '8210870F-CCA3-4D15-8CA6-0F6CAA557F9A',  'TRUE', 'bool', '', '', 3, 1, 1)
GO
INSERT INTO Setting ([GUID], Name, DisplayName, SettingTypeGUID, [Value], ValueType, ValueReference, TooltipText, [Order], UserEditable, [Required])
VALUES ('57B9FDE3-3075-4802-9DEB-73EBA479782E', 'LOG_WARNING', 'Log Warning', '8210870F-CCA3-4D15-8CA6-0F6CAA557F9A',  'TRUE', 'bool', '', '', 4, 1, 1)
GO
INSERT INTO Setting ([GUID], Name, DisplayName, SettingTypeGUID, [Value], ValueType, ValueReference, TooltipText, [Order], UserEditable, [Required])
VALUES ('D716ECEB-367F-47A1-AA86-399E253CE363', 'LOG_ERROR', 'Log Error', '8210870F-CCA3-4D15-8CA6-0F6CAA557F9A',  'TRUE', 'bool', '', '', 5, 1, 1)
GO

-- Global Admin
IF NOT EXISTS (SELECT * FROM [Role] WHERE Name = 'Global Admin' AND IsSystemRole = 1) 
BEGIN
	PRINT 'Inserting Global Admin role...'
	INSERT INTO [Role] ([GUID], Name, [Description], IsSystemRole, Deleted)
	VALUES ('4EB0771C-1A22-4941-9A89-A013E676F962', 'Global Admin',
		'System wide administration rights', 1, 0)
END
ELSE
BEGIN
	PRINT 'Global Admin role already exists.'
END

-- Global View
IF NOT EXISTS (SELECT * FROM [Role] WHERE Name = 'Global View' AND IsSystemRole = 1) 
BEGIN
	PRINT 'Inserting Global View role...'
	INSERT INTO [Role] ([GUID], Name, [Description], IsSystemRole, Deleted)
	VALUES ('1FAC7817-2CF3-41C2-A34F-C1227EA5F8DF', 'Global View',
		'System wide view rights', 1, 0)
END
ELSE
BEGIN
	PRINT 'Global View role already exists.'
END
GO

-- Policy Type - Role
IF NOT EXISTS (SELECT * FROM [PolicyType] WHERE Code = 'ROLE') 
BEGIN
	PRINT 'Policy Type: ROLE ...'
	INSERT INTO [PolicyType] ([GUID], Name, Code, Deleted)
	VALUES ('642F2E12-903B-474F-AEC7-022404218864', 'Roles', 'ROLE', 0)
END
ELSE
BEGIN
	PRINT 'Policy type ROLE already exists.'
END

-- Policy Type - BIZNET
IF NOT EXISTS (SELECT * FROM [PolicyType] WHERE Code = 'BIZNET') 
BEGIN
	PRINT 'Policy Type: BIZNET ...'
	INSERT INTO [PolicyType] ([GUID], Name, Code, Deleted)
	VALUES ('FA9AC2D1-E02C-43AA-89DA-EAC5262D5ADB', 'Business Network', 'BIZNET', 0)
END
ELSE
BEGIN
	PRINT 'Policy type BIZNET already exists.'
END

-- Policy Type - USER
IF NOT EXISTS (SELECT * FROM [PolicyType] WHERE Code = 'USER') 
BEGIN
	PRINT 'Policy Type: USER ...'
	INSERT INTO [PolicyType] ([GUID], Name, Code, Deleted)
	VALUES ('8AC29427-630A-43F5-9AED-5BECC99DA29F', 'Users', 'USER', 0)
END
ELSE
BEGIN
	PRINT 'Policy type USER already exists.'
END
GO

-- Policy - Roles
IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'ROLE_VIEW') 
BEGIN
	PRINT 'Policy: ROLE_VIEW ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('98FBF648-ED8D-47B1-AA3B-08D11B5468B5', 'View Roles', 'ROLE_VIEW', '642F2E12-903B-474F-AEC7-022404218864', 1, 0)
END
ELSE
BEGIN
	PRINT 'Policy ROLE_VIEW already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'ROLE_ADD') 
BEGIN
	PRINT 'Policy: ROLE_ADD ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('9B89B192-59DB-4A57-967A-FDDFB6B0A44A', 'Add Role', 'ROLE_ADD', '642F2E12-903B-474F-AEC7-022404218864', 2, 0)
END
ELSE
BEGIN
	PRINT 'Policy ROLE_ADD already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'ROLE_UPDATE') 
BEGIN
	PRINT 'Policy: ROLE_UPDATE ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('AD0752CD-D4C9-480C-A4BD-0AE545A47ADC', 'Update Role', 'ROLE_UPDATE', '642F2E12-903B-474F-AEC7-022404218864', 3, 0)
END
ELSE
BEGIN
	PRINT 'Policy ROLE_UPDATE already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'ROLE_DELETE') 
BEGIN
	PRINT 'Policy: ROLE_DELETE ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('EE62727A-3A29-4E30-9BEE-553FA5ED829C', 'Delete Role', 'ROLE_DELETE', '642F2E12-903B-474F-AEC7-022404218864', 4, 0)
END
ELSE
BEGIN
	PRINT 'Policy ROLE_DELETE already exists.'
END
GO

-- Policy - Users
IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'USER_VIEW') 
BEGIN
	PRINT 'Policy: USER_VIEW ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('96DEF4CA-32EC-41F1-853A-81F87CA1E943', 'View Users', 'USER_VIEW', '8AC29427-630A-43F5-9AED-5BECC99DA29F', 1, 0)
END
ELSE
BEGIN
	PRINT 'Policy USER_VIEW already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'USER_ADD') 
BEGIN
	PRINT 'Policy: USER_ADD ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('6DA4178C-4E6A-44F0-B910-E7B0553E5D3B', 'Add User', 'USER_ADD', '8AC29427-630A-43F5-9AED-5BECC99DA29F', 2, 0)
END
ELSE
BEGIN
	PRINT 'Policy USER_ADD already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'USER_DELETE') 
BEGIN
	PRINT 'Policy: USER_DELETE ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('8E974CB2-82F9-4287-B0E2-55E0DCA19999', 'Delete User', 'USER_DELETE', '8AC29427-630A-43F5-9AED-5BECC99DA29F', 3, 0)
END
ELSE
BEGIN
	PRINT 'Policy USER_DELETE already exists.'
END
GO

-- Policy - Business Network
IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'BIZNET_VIEW') 
BEGIN
	PRINT 'Policy: BIZNET_VIEW ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('310024CC-7372-4F00-A630-70C3F8F8A07D', 'View Business Network', 'BIZNET_VIEW', 'FA9AC2D1-E02C-43AA-89DA-EAC5262D5ADB', 1, 0)
END
ELSE
BEGIN
	PRINT 'Policy BIZNET_VIEW already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'BIZNET_ADD') 
BEGIN
	PRINT 'Policy: BIZNET_ADD ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('96A242CE-857C-4491-8645-8A304D18DDD0', 'Add Business Network', 'BIZNET_ADD', 'FA9AC2D1-E02C-43AA-89DA-EAC5262D5ADB', 2, 0)
END
ELSE
BEGIN
	PRINT 'Policy BIZNET_ADD already exists.'
END

IF NOT EXISTS (SELECT * FROM [Policy] WHERE Code = 'BIZNET_DELETE') 
BEGIN
	PRINT 'Policy: BIZNET_DELETE ...'
	INSERT INTO [Policy] ([GUID], Name, Code, PolicyTypeGUID, SortOrder, Deleted)
	VALUES ('F43AD24C-AAE3-4676-A9CA-C60BCF6B3691', 'Delete Business Network', 'BIZNET_DELETE', 'FA9AC2D1-E02C-43AA-89DA-EAC5262D5ADB', 3, 0)
END
ELSE
BEGIN
	PRINT 'Policy BIZNET_DELETE already exists.'
END
GO

-- basic role - policy links
DECLARE @rolGUID uniqueidentifier

IF NOT EXISTS (SELECT TOP 1 * FROM Role_Policy)
BEGIN
	-- Global Admin
	SET @rolGUID = NULL
	SELECT @rolGUID = [GUID] FROM [Role] WHERE Name = 'Global Admin'
	IF @rolGUID IS NOT NULL
	BEGIN
		INSERT INTO Role_Policy (GUID, RoleGUID, PolicyGUID, Allow)
		SELECT newid(), @rolGUID, [GUID], 1
		FROM Policy
		WHERE Deleted = 0
	END

	-- Global Admin
	SET @rolGUID = NULL
	SELECT @rolGUID = [GUID] FROM [Role] WHERE Name = 'Global View'
	IF @rolGUID IS NOT NULL
	BEGIN
		INSERT INTO Role_Policy (GUID, RoleGUID, PolicyGUID, Allow)
		SELECT newid(), @rolGUID, [GUID], 1
		FROM Policy
		WHERE Deleted = 0 AND Code LIKE '%VIEW%'
	END
END
GO

IF NOT EXISTS (SELECT * FROM [ObjectPropertyType] WHERE Code = 'BOOL') 
BEGIN
	PRINT 'ObjectPropertyType: boolean'
	INSERT INTO [ObjectPropertyType] ([GUID], Name, Code)
	VALUES ('A27F9D38-114A-4D61-9978-D97DCB9C028E', 'Boolean', 'BOOL')
END
ELSE
BEGIN
	PRINT 'ObjectPropertyType: boolean already exists.'
END

IF NOT EXISTS (SELECT * FROM [ObjectPropertyType] WHERE Code = 'NUMERIC') 
BEGIN
	PRINT 'ObjectPropertyType: numeric'
	INSERT INTO [ObjectPropertyType] ([GUID], Name, Code)
	VALUES ('7FE6FEAC-BCFE-47BA-BA12-20B5BBD522C2', 'Numeric', 'NUMERIC')
END
ELSE
BEGIN
	PRINT 'ObjectPropertyType: numeric already exists.'
END

IF NOT EXISTS (SELECT * FROM [ObjectPropertyType] WHERE Code = 'TEXT') 
BEGIN
	PRINT 'ObjectPropertyType: text'
	INSERT INTO [ObjectPropertyType] ([GUID], Name, Code)
	VALUES ('6951D1E4-60E1-4E0B-9D76-5C713AE01CF7', 'Text', 'TEXT')
END
ELSE
BEGIN
	PRINT 'ObjectPropertyType: text already exists.'
END

IF NOT EXISTS (SELECT * FROM [ObjectPropertyType] WHERE Code = 'COMPLEX') 
BEGIN
	PRINT 'ObjectPropertyType: complex'
	INSERT INTO [ObjectPropertyType] ([GUID], Name, Code)
	VALUES ('8B94C368-4343-4F7E-A314-4F062C77A7F7', 'Complex Object', 'COMPLEX')
END
ELSE
BEGIN
	PRINT 'ObjectPropertyType: complex already exists.'
END
GO

-- timeline
IF NOT EXISTS (SELECT * FROM ChartCategory WHERE Code = 'TIMELINE')
BEGIN
	INSERT INTO ChartCategory ([GUID], Name, Code, [Description], [Enabled])
	VALUES ('D5ADF89A-0DAB-4D11-8B68-855401213B60', 'Timeline', 'TIMELINE', '', 1)
END

-- pie
IF NOT EXISTS (SELECT * FROM ChartCategory WHERE Code = 'PIE')
BEGIN
	INSERT INTO ChartCategory ([GUID], Name, Code, [Description], [Enabled])
	VALUES ('244532E5-DCFE-415B-9F49-740B6B491580', 'Pie', 'PIE', '', 1)
END

-- ChartTypes
-- timeline - line
IF NOT EXISTS (SELECT * FROM ChartType WHERE ChartCategoryGUID = 'D5ADF89A-0DAB-4D11-8B68-855401213B60' AND Code = 'LINE')
BEGIN
	INSERT INTO ChartType ([GUID], Name, Code, ChartCategoryGUID, [Description], [Enabled])
	VALUES ('31D5BC78-2467-499C-BCB7-8D62C6B163F4', 'Line', 'LINE', 'D5ADF89A-0DAB-4D11-8B68-855401213B60', '', 1)
END
GO