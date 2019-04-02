CREATE TABLE [dbo].[Setting] (
    [GUID]              UNIQUEIDENTIFIER NOT NULL,
    [Name]              VARCHAR (50)     NOT NULL,
    [DisplayName]       VARCHAR (50)     NOT NULL,
    [SettingTypeGUID]   UNIQUEIDENTIFIER NULL,
    [Value]             NVARCHAR (MAX)   NOT NULL,
    [ValueType]         NVARCHAR (50)    NULL,
    [ValueReference]    NVARCHAR (MAX)   NULL,
    [TooltipText]       NVARCHAR (250)   NULL,
    [Order]             INT              NULL,
    [UserEditable]      BIT              DEFAULT ((1)) NOT NULL,
    [Required]          BIT              DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([GUID] ASC),
    CONSTRAINT [FK_Setting_SettingType] FOREIGN KEY ([SettingTypeGUID]) REFERENCES [dbo].[SettingType] ([GUID])
);

GO
