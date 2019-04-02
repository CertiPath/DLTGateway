CREATE TABLE [dbo].[BusinessNetwork_FileUpload]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [BusinessNetworkGUID] UNIQUEIDENTIFIER NOT NULL, 
    [FileUploadGUID] UNIQUEIDENTIFIER NOT NULL, 
    [Deleted] BIT NOT NULL, 
    CONSTRAINT [FK_BusinessNetwork_FileUpload_BusinessNetwork] FOREIGN KEY ([BusinessNetworkGUID]) REFERENCES [BusinessNetwork]([GUID]), 
    CONSTRAINT [FK_BusinessNetwork_FileUpload_FileUpload] FOREIGN KEY ([FileUploadGUID]) REFERENCES [FileUpload]([GUID])
)
