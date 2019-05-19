CREATE TABLE [dbo].[UserGroup]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(250) NOT NULL, 
    [SID] NVARCHAR(100) NOT NULL, 
    [Deleted] BIT NOT NULL, 
    [IsActiveDirectory] BIT NOT NULL DEFAULT 0, 
    [IsSecurityGroup] BIT NOT NULL DEFAULT 1, 
    [msDSPrincipalName] NVARCHAR(250) NULL
)
