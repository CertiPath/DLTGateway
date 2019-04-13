CREATE TABLE [dbo].[ChartType]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(50) NOT NULL, 
    [Code] NVARCHAR(50) NOT NULL, 
    [ChartCategoryGUID] UNIQUEIDENTIFIER NOT NULL, 
    [Description] NVARCHAR(500) NOT NULL, 
    [Enabled] BIT NOT NULL, 
    CONSTRAINT [FK_ChartType_ChartCategory] FOREIGN KEY ([ChartCategoryGUID]) REFERENCES [ChartCategory]([GUID])
)
