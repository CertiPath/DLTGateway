CREATE TABLE [dbo].[BusinessNetworkNamespace]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(100) NOT NULL, 
    [BusinessNetworkGUID] UNIQUEIDENTIFIER NOT NULL, 
    [SingleObjectNamespace] BIT NOT NULL DEFAULT 0, 
    [Deleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_BusinessNetworkNamespace_BusinessNetwork] FOREIGN KEY ([BusinessNetworkGUID]) REFERENCES [BusinessNetwork]([GUID])
)
