CREATE TABLE [dbo].[BusinessNetwork] (
    [GUID]                    UNIQUEIDENTIFIER NOT NULL,
    [BlockchainFrameworkGUID] UNIQUEIDENTIFIER NOT NULL,
    [Name]                    NVARCHAR (250)   NOT NULL,
    [ChannelName]             NVARCHAR (100)   NULL,
    [PeerAddress]             NVARCHAR (100)   NULL,
    [CryptoMaterialDirectory] NVARCHAR (100)   NULL,
    [Username]                NVARCHAR (100)   NULL,
    [Endpoint]                NVARCHAR (250)   NULL,
    [Deleted]                 BIT              CONSTRAINT [DF__BusinessN__Delet__5CD6CB2B] DEFAULT ((0)) NOT NULL,
    [LastBlockProcessed]      INT              NULL,
    [Disabled]                BIT              CONSTRAINT [DF__BusinessN__Disab__5DCAEF64] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK__Business__15B69B8ED15A3448] PRIMARY KEY CLUSTERED ([GUID] ASC),
    CONSTRAINT [FK_BusinessNetwork_BlockchainFramework] FOREIGN KEY ([BlockchainFrameworkGUID]) REFERENCES [dbo].[BlockchainFramework] ([GUID])
);



GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'URL to an Ethereum network. Example: https://ropsten.infura.io/v3/YOUR-PROJECT-ID. See https://infura.io/docs/gettingStarted/chooseaNetwork', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'BusinessNetwork', @level2type = N'COLUMN', @level2name = N'Endpoint';

