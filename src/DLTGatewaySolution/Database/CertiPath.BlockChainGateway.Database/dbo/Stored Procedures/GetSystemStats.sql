CREATE PROCEDURE [dbo].[GetSystemStats]
	 @offsetHours as int
AS
	
	DECLARE @countAllTransactions as int
	DECLARE @countTransactionsToday as int
	DECLARE @numberOfNetworks as int
	DECLARE @numberOfObjectsBeingTracked as int 

	SELECT @countAllTransactions = COUNT(*) FROM TransactionHistory
	SELECT @countTransactionsToday = COUNT(*) FROM TransactionHistory WHERE CAST(DATEADD(HOUR, @offsetHours, CreatedOn) as DATE) = CAST(DATEADD(HOUR, @offsetHours, getutcdate()) as DATE)
	SELECT @numberOfNetworks = COUNT(*) FROM BusinessNetwork WHERE Deleted = 0
	SELECT @numberOfObjectsBeingTracked = COUNT(*) FROM BusinessNetworkObject 

	SELECT
		@countAllTransactions as CountAllTransactions,
		@countTransactionsToday as CountTransactionsToday,
		@numberOfNetworks as NumberOfNetworks,
		@numberOfObjectsBeingTracked as NumberOfObjectsTracked

RETURN 0
