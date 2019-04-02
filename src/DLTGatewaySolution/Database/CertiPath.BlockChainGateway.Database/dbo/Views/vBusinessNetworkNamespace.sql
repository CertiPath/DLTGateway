CREATE VIEW [dbo].[vBusinessNetworkNamespace]
	AS 

	SELECT bnn.BusinessNetworkGUID, bnn.[GUID] as BusinessNetworkNamespaceGUID, bnn.Name as BusinessNetworkNamespaceName, 
		SUM(
			CASE
				WHEN bno.[GUID] IS NULL THEN 0
				ELSE 1
			END
		)  as ObjectCount
	FROM BusinessNetworkNamespace bnn
	LEFT JOIN BusinessNetworkObject bno ON bnn.[GUID] = bno.BusinessNetworkNamespaceGUID
		AND bno.Deleted = 0
	WHERE bnn.Deleted = 0
	GROUP BY bnn.BusinessNetworkGUID, bnn.[GUID], bnn.Name
