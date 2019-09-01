CREATE TABLE [dbo].[TransactionHistory]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
	[BusinessNetworkGUID] UNIQUEIDENTIFIER NOT NULL, 
    [TransactionID] NVARCHAR(100) NOT NULL, 
    [Data] NVARCHAR(MAX) NOT NULL, 
    [ChannelName] NVARCHAR(100) NULL, 
    [ChaincodeName] NVARCHAR(100) NULL, 
    [Version] NVARCHAR(100) NULL,
	[MspID] NVARCHAR(100) NULL, 
    [Method] NVARCHAR(100) NULL, 
    [Arguments] NVARCHAR(250) NULL, 
    [CreatedOn] DATETIME2 NOT NULL, 
    [IsProcessed] BIT NOT NULL DEFAULT 0, 
    [ProcessedOn] DATETIME2 NULL, 
    [ProcessedNote] NVARCHAR(MAX) NULL, 
    CONSTRAINT [FK_TransactionHistory_BusinessNetwork] FOREIGN KEY ([BusinessNetworkGUID]) REFERENCES [BusinessNetwork]([GUID]), 
    
)

GO

CREATE INDEX [IX_TransactionHistory_TransactionID] ON [dbo].[TransactionHistory] ([TransactionID])

GO

CREATE INDEX [IX_TransactionHistory_ChaincodeName] ON [dbo].[TransactionHistory] ([ChaincodeName])
