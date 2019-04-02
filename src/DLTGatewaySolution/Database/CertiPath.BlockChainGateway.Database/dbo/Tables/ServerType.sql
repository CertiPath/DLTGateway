CREATE TABLE [dbo].[ServerType]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL , 
    [Name] NVARCHAR(50) NOT NULL, 
    [DisplayName] NVARCHAR(50) NOT NULL, 
    PRIMARY KEY ([GUID])
)
