CREATE VIEW [dbo].[vNamespaceTransactionsPerDay]
	AS 
		SELECT NEWID() AS KeyGUID, bnn.[GUID] as NamespaceGUID, bnn.Name as NamespaceName, 
			CAST(
				DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn) as DATE
			) as TransactionDate, 
			DATENAME(DW, (DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn))) as TransactionDayName, 
			COUNT (*) as TransactionCount
		FROM TransactionHistory thi
		INNER JOIN BusinessNetworkNamespace bnn ON thi.BusinessNetworkGUID = bnn.BusinessNetworkGUID
		GROUP BY bnn.[GUID], bnn.Name, 
			CAST(DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn) as DATE), 
			DATENAME(DW, (DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn)))