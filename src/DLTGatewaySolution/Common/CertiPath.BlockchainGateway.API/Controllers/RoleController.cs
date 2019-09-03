using CertiPath.BlockchainGateway.API.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RoleController : BaseController
    {
        /// <summary>
        /// This will get only global roles
        /// </summary>
        /// <returns></returns>
        /// 
        [SuperAdmin]
        public List<Model.RoleViewModel> GetAll()
        {
            Service.Role roleSrv = new Service.Role(DatabaseContext);
            var list = roleSrv.GetAll(true);
            return list;
        }

        public List<Model.UserGroupRoleModel> GetUserGroups(Guid RoleGUID)
        {
            Service.Role roleSrv = new Service.Role(DatabaseContext);
            var list = roleSrv.GetUserGroups(RoleGUID, null);
            return list;
        }

        public List<Model.UserGroupRoleModel> GetUserGroupsLocal(Guid RoleGUID, Guid BusinessNetworkGUID)
        {
            if (CanViewNetwork(BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            Service.Role roleSrv = new Service.Role(DatabaseContext);
            var list = roleSrv.GetUserGroups(RoleGUID, BusinessNetworkGUID);
            return list;
        }

        [HttpPost]
        public void DeleteUserGroup(Model.UserGroupRoleModel m)
        {
            var ugr = DatabaseContext.Role_UserGroup.Where(w => w.GUID == m.GUID).SingleOrDefault();
            if (CanAdminNetwork(ugr.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            Service.Role roleSrv = new Service.Role(DatabaseContext);
            roleSrv.DeleteUserGroup(m.GUID);
        }

        [HttpPost]
        public void AddActiveDirectoryGroup(Model.RoleADGroupModel model)
        {
            if (CanAdminNetwork(model.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            Service.Role roleSrv = new Service.Role(DatabaseContext);
            roleSrv.AddUserGroup(model);
        }

        public List<Model.RoleViewModel> GetAllLocal()
        {
            Service.Role roleSrv = new Service.Role(DatabaseContext);
            var list = roleSrv.GetAll(false);
            return list;
        }
    }
}
