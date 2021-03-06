﻿CREATE TABLE [dbo].[BusinessNetworkObjectChart]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(100) NOT NULL, 
    [Description] NVARCHAR(500) NOT NULL, 
    [BusinessNetworkObjectGUID] UNIQUEIDENTIFIER NOT NULL, 
    [ChartTypeGUID] UNIQUEIDENTIFIER NOT NULL, 
    [ChartSettings] NVARCHAR(MAX) NOT NULL, 
    [SortOrder] INT NOT NULL DEFAULT 0, 
    [Deleted] BIT NOT NULL DEFAULT 0, 
    [Disabled] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_BusinessNetworkObjectChart_BusinessNetworkObject] FOREIGN KEY ([BusinessNetworkObjectGUID]) REFERENCES [dbo].[BusinessNetworkObject]([GUID]), 
    CONSTRAINT [FK_BusinessNetworkObjectChart_ChartType] FOREIGN KEY ([ChartTypeGUID]) REFERENCES [ChartType]([GUID])
)
