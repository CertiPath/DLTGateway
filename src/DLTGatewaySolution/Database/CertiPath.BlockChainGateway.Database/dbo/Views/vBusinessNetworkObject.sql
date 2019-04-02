CREATE VIEW [dbo].[vBusinessNetworkObject]
	AS 
		SELECT bno.BusinessNetworkNamespaceGUID, bno.[GUID] as BusinessNetworkObjectGUID, bno.ClassName as BusinessNetworkObjectClassName, 
			bno.Name as BusinessNetworkObjectName, 
			SUM(
				CASE
					WHEN dst.[GUID] IS NULL THEN 0
					ELSE 1
				END
			)  as ObjectCount
		FROM BusinessNetworkObject bno
		LEFT JOIN DataStore dst ON bno.[GUID] = dst.BusinessNetworkObjectGUID
		GROUP BY bno.BusinessNetworkNamespaceGUID, bno.[GUID], bno.ClassName, bno.Name
