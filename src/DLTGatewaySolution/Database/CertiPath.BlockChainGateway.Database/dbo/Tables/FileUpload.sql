﻿CREATE TABLE [dbo].[FileUpload]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(250) NOT NULL,
	[FileName] NVARCHAR(250) NOT NULL DEFAULT '',
    [TypeExtension] NVARCHAR(50) NOT NULL, 
    [FileContent] VARBINARY(MAX) NOT NULL, 
    [Deleted] BIT NOT NULL
)
