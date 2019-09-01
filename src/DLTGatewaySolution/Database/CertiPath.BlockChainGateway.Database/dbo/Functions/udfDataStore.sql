CREATE FUNCTION [dbo].[udfDataStore]
(
	@sidList NVARCHAR(MAX),
	@ignoreGroups bit
)
RETURNS
@ResultTable TABLE 
(
	-- Add the column definitions for the TABLE variable here
	[BusinessNetworkGUID]							UNIQUEIDENTIFIER NOT NULL,
	[BusinessNetworkName]							NVARCHAR(250)	 NOT NULL,
	[BusinessNetworkNamespaceGUID]					UNIQUEIDENTIFIER NOT NULL,
	[BusinessNetworkNamespaceName]					NVARCHAR(250)	 NOT NULL,
	[BusinessNetworkObjectGUID]						UNIQUEIDENTIFIER NOT NULL,
	[BusinessNetworkObjectClassName]				NVARCHAR(250)	 NOT NULL,
	[BusinessNetworkObjectName]						NVARCHAR(250)	 NOT NULL,
	[DataStoreGUID]									UNIQUEIDENTIFIER NOT NULL,
	[DataStoreIsDeleted]							BIT NOT NULL,
	[DataStoreSourceID]								NVARCHAR(100)	 NULL,
	[DataStoreValue]								NVARCHAR(MAX)	 NULL,
	[DataStoreLastUpdatedOn]						DATETIME2		 NULL

)
AS
BEGIN

	INSERT @ResultTable
	SELECT *
	FROM (
		
		SELECT 
			bne.[GUID] as BusinessNetworkGUID, bne.[Name] as BusinessNetworkName,
			bnn.[GUID] as BusinessNetworkNamespaceGUID, bnn.[Name] as BusinessNetworkNamespaceName, 
			bno.[GUID] as BusinessNetworkObjectGUID, bno.ClassName as BusinessNetworkObjectClassName, bno.Name as BusinessNetworkObjectName,
			dst.[GUID] as DataStoreGUID, dst.IsDeleted as DataStoreIsDeleted, dst.SourceID as DataStoreSourceID, 
			dst.Value as DataStoreValue, dst.LastUpdatedOn as DataStoreLastUpdatedOn
		FROM DataStore dst
		INNER JOIN BusinessNetworkObject bno ON dst.BusinessNetworkObjectGUID = bno.[GUID]
		INNER JOIN BusinessNetworkNamespace bnn ON bno.BusinessNetworkNamespaceGUID = bnn.[GUID]
		INNER JOIN BusinessNetwork bne ON bnn.BusinessNetworkGUID = bne.[GUID]
		INNER JOIN udfUserBusinessNetwork(@sidList, @ignoreGroups) ubn ON bne.[GUID] = ubn.[GUID]
	) a

	RETURN
END
