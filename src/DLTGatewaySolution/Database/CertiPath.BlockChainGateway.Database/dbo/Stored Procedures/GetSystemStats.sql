CREATE PROCEDURE [dbo].[GetSystemStats]
	 @offsetHours as int,
	 @sidList NVARCHAR(MAX),
	 @ignoreGroups bit
AS
	
	DECLARE @countAllTransactions as int
	DECLARE @countTransactionsToday as int
	DECLARE @numberOfNetworks as int
	DECLARE @numberOfObjectsBeingTracked as int 

	SELECT @countAllTransactions = COUNT(*) 
	FROM TransactionHistory thi
	INNER JOIN udfUserBusinessNetwork(@sidList, @ignoreGroups) ubn ON thi.BusinessNetworkGUID = ubn.[GUID]
	
	SELECT @countTransactionsToday = COUNT(*) 
	FROM TransactionHistory thi
	INNER JOIN udfUserBusinessNetwork(@sidList, @ignoreGroups) ubn ON thi.BusinessNetworkGUID = ubn.[GUID]
	WHERE CAST(DATEADD(HOUR, @offsetHours, thi.CreatedOn) as DATE) = CAST(DATEADD(HOUR, @offsetHours, getutcdate()) as DATE)
	
	SELECT @numberOfNetworks = COUNT(*) 
	FROM BusinessNetwork bne 
	INNER JOIN udfUserBusinessNetwork(@sidList, @ignoreGroups) ubn ON bne.[GUID] = ubn.[GUID]
	WHERE bne.Deleted = 0
	
	SELECT @numberOfObjectsBeingTracked = COUNT(*) 
	FROM BusinessNetworkObject bno
	INNER JOIN dbo.BusinessNetworkNamespace bnn ON bno.BusinessNetworkNamespaceGUID = bnn.[GUID] 
		AND bnn.Deleted = 0
	INNER JOIN udfUserBusinessNetwork(@sidList, @ignoreGroups) ubn ON bnn.BusinessNetworkGUID = ubn.[GUID]
	WHERE bno.Deleted = 0

	SELECT
		@countAllTransactions as CountAllTransactions,
		@countTransactionsToday as CountTransactionsToday,
		@numberOfNetworks as NumberOfNetworks,
		@numberOfObjectsBeingTracked as NumberOfObjectsTracked

RETURN 0
