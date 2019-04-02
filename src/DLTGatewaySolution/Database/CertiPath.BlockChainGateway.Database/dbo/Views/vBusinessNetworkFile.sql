CREATE VIEW [dbo].[vBusinessNetworkFile]
	AS 
	SELECT bne.[GUID] AS BusinessNetworkGUID, bne.Name AS BusinessNetworkName,
		fup.[GUID] AS FileUploadGUID, fup.[Name] AS FileUploadName, fup.FileContent AS FileUploadContent, 
		fup.TypeExtension AS FileUploadTypeExtension, fup.[FileName] AS FileUploadFileName
	FROM BusinessNetwork bne
	INNER JOIN BusinessNetwork_FileUpload bnfu ON bne.[GUID] = bnfu.BusinessNetworkGUID
		AND bnfu.Deleted = 0
	INNER JOIN FileUpload fup ON bnfu.FileUploadGUID = fup.[GUID]
		AND fup.Deleted = 0
