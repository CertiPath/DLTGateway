CREATE FUNCTION [dbo].[udfUserBusinessNetworkLocalView]
(
	@sidList NVARCHAR(MAX)
)
RETURNS
@ResultTable TABLE 
(
	-- Add the column definitions for the TABLE variable here
	[GUID]							UNIQUEIDENTIFIER NOT NULL,
	[BlockchainFrameworkGUID]		UNIQUEIDENTIFIER NOT NULL,
	[Name]							NVARCHAR(250)	 NOT NULL--,
	--[SID]					NVARCHAR(250)	 
)
AS
BEGIN

	DECLARE @tblSID table (value nvarchar(100))

	INSERT @tblSID
    SELECT *
    FROM STRING_SPLIT(@sidList, ',')


	INSERT @ResultTable
	SELECT *
	FROM (
		
		SELECT DISTINCT bne.GUID, bne.[BlockchainFrameworkGUID], bne.Name --, ugr.SID
		FROM dbo.BusinessNetwork bne
		INNER JOIN [Role_UserGroup] rug ON bne.GUID = rug.BusinessNetworkGUID
		INNER JOIN [UserGroup] ugr ON rug.UserGroupGUID = ugr.GUID
		INNER JOIN [Role] rol ON rug.RoleGUID = rol.[GUID] AND rol.IsSystemRole = 0
			AND rol.Code = 'LOCALVIEW'
		INNER JOIN @tblSID tblSID ON ugr.SID = tblSID.value
			AND tblSID.value IS NOT NULL
		WHERE bne.Deleted = 0
			

	) a

	RETURN
END
