-- will delete all transactions that are older than a month 
-- DELETE FROM AuditLog
DELETE FROM DataStore WHERE LastUpdatedOn < DATEADD(month, -1, GETDATE())
DELETE FROM TransactionHistory WHERE CreatedOn < DATEADD(month, -1, GETDATE())