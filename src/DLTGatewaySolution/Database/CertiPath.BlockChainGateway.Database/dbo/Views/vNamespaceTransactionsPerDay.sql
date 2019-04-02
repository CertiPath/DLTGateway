CREATE VIEW [dbo].[vNamespaceTransactionsPerDay]
	AS 
		-- TODO: This table should really have a link to network namespace and not to the business network
		-- once that is fixed the matching on name will not be needed
		SELECT NEWID() AS KeyGUID, bnn.[GUID] as NamespaceGUID, bnn.Name as NamespaceName, 
			CAST(
				DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn) as DATE
			) as TransactionDate, 
			DATENAME(DW, CreatedOn) as TransactionDayName, COUNT (*) as TransactionCount
		FROM TransactionHistory thi
		INNER JOIN BusinessNetworkNamespace bnn ON thi.ChaincodeName = bnn.Name
		GROUP BY bnn.[GUID], bnn.Name, CAST(DATEADD(HOUR, DATEDIFF(HOUR, SYSDATETIMEOFFSET(), getdate()), CreatedOn) as DATE), DATENAME(DW, CreatedOn)