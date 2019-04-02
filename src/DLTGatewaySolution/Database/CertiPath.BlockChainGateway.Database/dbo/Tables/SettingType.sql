CREATE TABLE [dbo].[SettingType]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [DisplayName] NVARCHAR(50) NULL, 
    [UserEditable] BIT NOT NULL DEFAULT 1, 
    [Order] INT NULL 
)
