CREATE TABLE [dbo].[BusinessNetworkObject]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [BusinessNetworkNamespaceGUID] UNIQUEIDENTIFIER NOT NULL, 
    [ClassName] NVARCHAR(250) NOT NULL, 
    [Name] NVARCHAR(100) NOT NULL, 
    [Deleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_BusinessNetworkObject_BusinessNetworkNamespace] FOREIGN KEY ([BusinessNetworkNamespaceGUID]) REFERENCES [BusinessNetworkNamespace]([GUID])
)
