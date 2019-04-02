CREATE TABLE [dbo].[DataStore]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [BusinessNetworkObjectGUID] UNIQUEIDENTIFIER NOT NULL, 
    [SourceID] NVARCHAR(100) NOT NULL, 
    [IsDeleted] BIT NOT NULL, 
    [Value] NVARCHAR(MAX) NOT NULL, 
    [TransactionHistoryGUID] UNIQUEIDENTIFIER NULL, 
    [LastUpdatedOn] DATETIME2 NULL, 
    CONSTRAINT [FK_DataStore_BusinessNetworkObject] FOREIGN KEY ([BusinessNetworkObjectGUID]) REFERENCES [BusinessNetworkObject]([GUID]), 
    CONSTRAINT [FK_DataStore_TransactionHistoryGUID] FOREIGN KEY ([TransactionHistoryGUID]) REFERENCES [TransactionHistory]([GUID]), 
    
)

GO

CREATE INDEX [IX_DataStore_SourceID] ON [dbo].[DataStore] ([SourceID])
