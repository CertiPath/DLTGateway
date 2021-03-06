USE [master]
GO
CREATE LOGIN [IIS APPPOOL\DefaultAppPool] FROM WINDOWS WITH DEFAULT_DATABASE=[CertiPath.BlockChainGateway.Database]
GO
USE [CertiPath.BlockChainGateway.Database]
GO
CREATE USER [IIS APPPOOL\DefaultAppPool] FOR LOGIN [IIS APPPOOL\DefaultAppPool]
GO
USE [CertiPath.BlockChainGateway.Database]
GO
ALTER USER [IIS APPPOOL\DefaultAppPool] WITH DEFAULT_SCHEMA=[dbo]
GO
USE [CertiPath.BlockChainGateway.Database]
GO
ALTER ROLE [db_datareader] ADD MEMBER [IIS APPPOOL\DefaultAppPool]
GO
USE [CertiPath.BlockChainGateway.Database]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [IIS APPPOOL\DefaultAppPool]
GO
USE [CertiPath.BlockChainGateway.Database]
GO
ALTER ROLE [db_owner] ADD MEMBER [IIS APPPOOL\DefaultAppPool]
GO
