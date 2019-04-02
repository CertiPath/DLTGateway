CREATE VIEW [dbo].[vNamespaceAndObjectTree]
	AS 

		SELECT bnn.BusinessNetworkGUID, bnn.[GUID] as BusinessNetworkNamespaceGUID, bnn.Name as BusinessNetworkNamespaceName, 
			bno.[GUID] as BusinessNetworkObjectGUID, bno.ClassName as BusinessNetworkObjectClassName, 
				bno.Name as BusinessNetworkObjectName, 
				SUM(
					CASE
						WHEN dst.[GUID] IS NULL THEN 0
						ELSE 1
					END
				)  as ObjectCount
		FROM BusinessNetworkNamespace bnn
		LEFT JOIN BusinessNetworkObject bno ON bnn.[GUID] = bno.BusinessNetworkNamespaceGUID
			AND bno.Deleted = 0
		LEFT JOIN DataStore dst ON bno.[GUID] = dst.BusinessNetworkObjectGUID
		GROUP BY bnn.BusinessNetworkGUID, bnn.[GUID], bnn.Name,
			bno.BusinessNetworkNamespaceGUID, bno.[GUID], bno.ClassName, bno.Name
