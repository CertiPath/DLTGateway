$Credential = Get-Credential -Message "[DLTGateway] Please enter a SQL login user name and password." -UserName "DLT_SQL_Login"
# https://www.computerperformance.co.uk/powershell/get-credential
$Credential.GetNetworkCredential().password | Out-File -encoding ascii ..\secrets\SQL_Login_PWD -NoNewline