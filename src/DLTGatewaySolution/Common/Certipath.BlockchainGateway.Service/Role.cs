using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;


namespace CertiPath.BlockchainGateway.Service
{
    public class Role
    {
        private DataModelContainer _context;
        private Helper.Common.EntityConverter _converter;

        public Role(DataModelContainer context)
        {
            _context = context;
            _converter = new Helper.Common.EntityConverter();
        }

        /// <summary>
        /// will always get only global/system roles
        /// </summary>
        /// <returns></returns>
        public List<RoleViewModel> GetAll(bool isGlobal)
        {
            List<RoleViewModel> list = new List<RoleViewModel>();
            
            var data = _context.Role
                            .Where(w => w.Deleted == false)
                            .Where(w => w.IsSystemRole == isGlobal)
                            .OrderBy(o => o.Name)
                            .ToList();
            
            foreach (var item in data)
            {
                list.Add(new RoleViewModel()
                {
                   GUID = item.GUID,
                   Name = item.Name,
                   Description = item.Description,
                   IsSystemRole = item.IsSystemRole,
                   Code = item.Code
                });
            }
            return list;
        }
        
        public void DeleteUserGroup(Guid GUID)
        {
            Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
            var ugr = _context.Role_UserGroup.Where(w => w.GUID == GUID).SingleOrDefault();
            string originalObject = converter.GetJson(ugr);
            ugr.Deleted = true;
            _context.SaveChanges();

            // Audit Log
            Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
            AuditLogModel alm = new AuditLogModel();

            alm.OperationType = AuditLogOperationType.Delete;
            alm.PrimaryObjectGUID = ugr.GUID;
            alm.PrimaryObjectType = AuditLogObjectType.Role_UserGroup;
            alm.SecondaryObjectGUID = ugr.RoleGUID;
            alm.SecondaryObjectType = AuditLogObjectType.Role;
            alm.NewRecordValue = converter.GetJson(ugr);
            alm.OldRecordValue = originalObject;
            alo.Save(alm);
        }

        public void AddUserGroup(RoleADGroupModel model)
        {
            Helper.ActiveDirectory.Group adGroup = new Helper.ActiveDirectory.Group(_context);
            var grp = adGroup.Save(model.Group);
            addUserGroup(model.RoleGUID, grp, model.BusinessNetworkGUID);
        }

        private DataLayer.Role_UserGroup addUserGroup(Guid RoleGUID, UserGroupModel userGroup, Guid? BusinessNetworkGUID)
        {
            var rug = _context.Role_UserGroup
                                        .Where(w => w.Deleted == false)
                                        .Where(w => w.RoleGUID == RoleGUID)
                                        .Where(w => w.UserGroupGUID == userGroup.GUID)
                                        .Where(w => w.BusinessNetworkGUID == BusinessNetworkGUID)
                                        .SingleOrDefault();

            if (rug == null)
            {
                rug = new Role_UserGroup()
                {
                    BusinessNetworkGUID = BusinessNetworkGUID,
                    Deleted = false,
                    GUID = Guid.NewGuid(),
                    RoleGUID = RoleGUID,
                    UserGroupGUID = userGroup.GUID
                };
                _context.Role_UserGroup.Add(rug);
                _context.SaveChanges();

                // Audit Log
                Helper.Common.EntityConverter converter = new Helper.Common.EntityConverter();
                Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
                AuditLogModel alm = new AuditLogModel();

                alm.OperationType = AuditLogOperationType.Create;
                alm.PrimaryObjectGUID = rug.GUID;
                alm.PrimaryObjectType = AuditLogObjectType.Role_UserGroup;
                alm.SecondaryObjectGUID = rug.RoleGUID;
                alm.SecondaryObjectType = AuditLogObjectType.Role;
                alm.NewRecordValue = converter.GetJson(rug);
                alm.OldRecordValue = "";
                alo.Save(alm);
            }
            return rug;
        }

        public List<Model.UserGroupRoleModel> GetUserGroups(Guid roleGUID, Guid? businessNetworkGUID)
        {
            var groups = _context.Role_UserGroup
                .Where(w => w.RoleGUID == roleGUID)
                .Where(w => w.BusinessNetworkGUID == businessNetworkGUID)
                .Where(w => w.Deleted == false)
                .Where(w => w.Role.Deleted == false)
                .ToList();

            List<Model.UserGroupRoleModel> list = new List<UserGroupRoleModel>();
            foreach (var group in groups)
            {
                list.Add(new UserGroupRoleModel()
                {
                    GUID = group.GUID,
                    RoleGUID = group.RoleGUID,
                    UserGroupGUID = group.UserGroupGUID,
                    RoleName = group.Role.Name,
                    UserGroupName = group.UserGroup.Name,
                    UserGroupSID = group.UserGroup.SID
                });
            }
            return list;
        }
    }
}
