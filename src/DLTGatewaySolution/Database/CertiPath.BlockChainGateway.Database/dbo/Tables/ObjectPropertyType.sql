﻿CREATE TABLE [dbo].[ObjectPropertyType]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [Code] NVARCHAR(50) NOT NULL
)