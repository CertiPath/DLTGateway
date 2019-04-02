CREATE VIEW [dbo].[vDataStore]
	AS 
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
