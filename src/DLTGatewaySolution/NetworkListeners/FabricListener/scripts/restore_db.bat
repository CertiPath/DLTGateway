@echo off
REM You can lookup the root directory property of your MSSQL Server
REM to figure out the location for data files.
SET SQL_DATA_DIR=C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA
SET BAK_FILE=C:\backup\dlt_01242019.bak
SET DB_NAME=CertiPath.BlockChainGateway.Database
@echo on
SqlCmd -E -S localhost -Q "RESTORE DATABASE [%DB_NAME%] FROM  DISK = N'%BAK_FILE%' WITH  FILE = 1, MOVE N'%DB_NAME%' TO N'%SQL_DATA_DIR%\%DB_NAME%_Primary.mdf', MOVE N'%DB_NAME%_log' TO N'%SQL_DATA_DIR%\%DB_NAME%_Primary.ldf', NOUNLOAD, STATS = 5"
