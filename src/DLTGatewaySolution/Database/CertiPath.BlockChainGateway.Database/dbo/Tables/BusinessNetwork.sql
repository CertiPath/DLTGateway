CREATE TABLE [dbo].[BusinessNetwork]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [BlockchainFrameworkGUID] UNIQUEIDENTIFIER NOT NULL, 
	[Name] NVARCHAR(250) NOT NULL, 

    [ChannelName] NVARCHAR(100) NULL, 
    [PeerAddress] NVARCHAR(100) NULL, 
    [CryptoMaterialDirectory] NVARCHAR(100) NULL, 
    [Username] NVARCHAR(100) NULL, 
    [Deleted] BIT NOT NULL DEFAULT 0, 
    [LastBlockProcessed] INT NULL, 
    [Disabled] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_BusinessNetwork_BlockchainFramework] FOREIGN KEY ([BlockchainFrameworkGUID]) REFERENCES [BlockchainFramework]([GUID])
)
