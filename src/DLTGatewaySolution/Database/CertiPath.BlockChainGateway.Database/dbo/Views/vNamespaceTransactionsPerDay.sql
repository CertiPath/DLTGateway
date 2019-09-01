CREATE VIEW [dbo].[vNamespaceTransactionsPerDay]
	AS 
		SELECT NEWID() AS KeyGUID, bnn.[GUID] as NamespaceGUID, bnn.Name as NamespaceName, 
			CAST(
				DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn) as DATE
			) as TransactionDate, 
			DATENAME(DW, (DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn))) as TransactionDayName, 
			COUNT (*) as TransactionCount, bne.[GUID] as BusinessNetworkGUID
		FROM TransactionHistory thi
		INNER JOIN BusinessNetworkNamespace bnn ON thi.ChaincodeName = bnn.Name
		INNER JOIN dbo.BusinessNetwork bne ON bnn.BusinessNetworkGUID = bne.[GUID]
			AND bnn.Deleted = 0
		GROUP BY bnn.[GUID], bnn.Name, 
			CAST(DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn) as DATE), 
			DATENAME(DW, (DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn))),
			bne.[GUID]