CREATE PROCEDURE [dbo].[AddTransaction]
	@networkGUID UNIQUEIDENTIFIER,
	@blockNumber INT,

	@transactionID NVARCHAR(100),
	@data NVARCHAR(MAX),
	@channelName NVARCHAR(100),
	@chaincodeName NVARCHAR(100),
	@mspid NVARCHAR(100),
	@version NVARCHAR(100)
AS
	-- update the block number first
	UPDATE BusinessNetwork 
	SET LastBlockProcessed = @blockNumber
	WHERE GUID = @networkGUID

	-- insert transaction details
	INSERT INTO [TransactionHistory] ([GUID], TransactionID, [Data], CreatedOn, ChannelName, ChaincodeName, MspID, [Version], BusinessNetworkGUID) 
	VALUES(newid(), @transactionID, @data, getutcdate(), @channelName, @chaincodeName, @mspid, @version, @networkGUID)

RETURN 0
