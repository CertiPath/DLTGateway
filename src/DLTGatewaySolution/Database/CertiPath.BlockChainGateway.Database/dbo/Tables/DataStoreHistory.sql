CREATE TABLE [dbo].[DataStoreHistory]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
	[DataStoreGUID] UNIQUEIDENTIFIER NOT NULL,
    [SourceID] NVARCHAR(100) NOT NULL, 
    [Value] NVARCHAR(MAX) NOT NULL, 
    [TransactionHistoryGUID] UNIQUEIDENTIFIER NULL, 
    [CreatedOn] DATETIME2 NOT NULL, 
    CONSTRAINT [FK_DataStoreHistory_TransactionHistoryGUID] FOREIGN KEY ([TransactionHistoryGUID]) REFERENCES [TransactionHistory]([GUID]), 
    CONSTRAINT [FK_DataStoreHistory_DataStore] FOREIGN KEY ([DataStoreGUID]) REFERENCES [dbo].[DataStore]([GUID])
    
)

GO