-- set recover mode to simple and truncate the logs
-- depending on the database the database name and log name will have to be adjusted
ALTER DATABASE [DLTGateway] SET RECOVERY SIMPLE
DBCC SHRINKFILE ('CertiPath.BlockChainGateway.Database_log', 0, TRUNCATEONLY)