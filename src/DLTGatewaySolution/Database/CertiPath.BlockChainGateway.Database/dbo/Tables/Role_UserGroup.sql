CREATE TABLE [dbo].[Role_UserGroup]
(
	[GUID] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [RoleGUID] UNIQUEIDENTIFIER NOT NULL, 
    [UserGroupGUID] UNIQUEIDENTIFIER NOT NULL, 
    [Deleted] BIT NOT NULL, 
    [BusinessNetworkGUID] UNIQUEIDENTIFIER NULL, 
    CONSTRAINT [FK_Role_UserGroup_RoleGUID] FOREIGN KEY ([RoleGUID]) REFERENCES [Role]([GUID]), 
    CONSTRAINT [FK_Role_UserGroup_UserGroupGUID] FOREIGN KEY ([UserGroupGUID]) REFERENCES [UserGroup]([GUID]), 
    CONSTRAINT [FK_Role_UserGroup_BusinessNetwork] FOREIGN KEY ([BusinessNetworkGUID]) REFERENCES [BusinessNetwork]([GUID])
)
