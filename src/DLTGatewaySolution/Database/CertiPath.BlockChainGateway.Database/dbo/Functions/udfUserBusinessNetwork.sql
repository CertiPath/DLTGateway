CREATE FUNCTION [dbo].[udfUserBusinessNetwork]
(
	@sidList NVARCHAR(MAX),
	@ignoreGroups bit
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
		LEFT JOIN 
		(
			[Role_UserGroup] rug
			LEFT JOIN [UserGroup] ugr ON rug.UserGroupGUID = ugr.GUID
			LEFT JOIN [Role] rol ON rug.RoleGUID = rol.[GUID] AND rol.IsSystemRole = 0
			LEFT JOIN @tblSID tblSID ON ugr.SID = tblSID.value
		)  ON bne.GUID = rug.BusinessNetworkGUID
		WHERE bne.Deleted = 0
			AND
				(
					@ignoreGroups = 1
					OR
					(
						@ignoreGroups = 0 AND
						tblSID.value IS NOT NULL
					)
				)

	) a

	RETURN
END
