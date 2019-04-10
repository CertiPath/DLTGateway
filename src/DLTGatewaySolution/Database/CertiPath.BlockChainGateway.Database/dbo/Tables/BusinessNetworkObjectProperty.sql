CREATE TABLE [dbo].[BusinessNetworkObjectProperty]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [ObjectPropertyTypeGUID] UNIQUEIDENTIFIER NOT NULL, 
	[BusinessNetworkObjectGUID] UNIQUEIDENTIFIER NOT NULL, 
    [Name] NVARCHAR(100) NOT NULL,
	[Visible] BIT NOT NULL,
    [Disabled] BIT NOT NULL, 
    [Deleted] BIT NOT NULL,  
    [IsImported] BIT NOT NULL DEFAULT 0, 
    [SortOrder] INT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_BusinessNetworkObjectProperty_ObjectPropertyType] FOREIGN KEY ([ObjectPropertyTypeGUID]) REFERENCES [ObjectPropertyType]([GUID]), 
    CONSTRAINT [FK_BusinessNetworkObjectProperty_BusinessNetworkObject] FOREIGN KEY ([BusinessNetworkObjectGUID]) REFERENCES [BusinessNetworkObject]([GUID])
)
