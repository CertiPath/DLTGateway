@echo off
SET DB_NAME=CertiPath.BlockChainGateway.Database
SET DB_LOGIN_ID=DLT_SQL_User
REM The %DB_LOGIN_PWD% variable should be set using `SETX DB_LOGIN_PWD enter_your_password_here`
@echo on

REM Enable Windows Authentication and SQL Login (mixed mode)
SqlCmd -E -S localhost -Q "USE [master] EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2"

REM Create a server login using an existing SID
SqlCmd -E -S localhost -Q "USE [%DB_NAME%]; CREATE LOGIN [%DB_LOGIN_ID%] WITH PASSWORD = '%DB_LOGIN_PWD%', SID = 0xB00E8B2CFC9E5841B6A09D362341FD53, DEFAULT_DATABASE = [master], CHECK_POLICY = ON, CHECK_EXPIRATION = OFF;"
