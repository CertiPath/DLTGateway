CREATE TABLE [dbo].[AuditLog]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
	[OperationType] NVARCHAR(50) NULL,
    [PrimaryObjectName] NVARCHAR(50) NOT NULL, 
	[PrimaryObjectGUID] UNIQUEIDENTIFIER NOT NULL, 
	[SecondaryObjectName] NVARCHAR(50) NULL, 
    [SecondaryObjectGUID] UNIQUEIDENTIFIER NULL, 
	
    [OldRecordValue] NVARCHAR(MAX) NULL, 
    [NewRecordValue] NVARCHAR(MAX) NULL,
    [TransactionSequence] INT NOT NULL,

    [ServerName] NVARCHAR(100) NOT NULL, 
    [ServerUTC] DATETIMEOFFSET NOT NULL, 
    [UserGUID] UNIQUEIDENTIFIER NOT NULL, 
	[UserName] NVARCHAR(100) NOT NULL, 
     
    CONSTRAINT [FK_AuditLog_CreatedBy] FOREIGN KEY ([UserGUID]) REFERENCES [User]([GUID])
)
