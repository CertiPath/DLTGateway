CREATE TABLE [dbo].[ChartCategory]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [Code] NVARCHAR(50) NOT NULL, 
    [Description] NVARCHAR(500) NOT NULL,
    [Enabled] BIT NOT NULL 
)
