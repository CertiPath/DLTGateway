CREATE TABLE [dbo].[BlockchainFramework]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [DisplayName] NVARCHAR(50) NOT NULL, 
    [Deleted] BIT NOT NULL DEFAULT 0
)
