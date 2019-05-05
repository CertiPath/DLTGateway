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
    [Authorize]
    public class RoleController : ApiController
    {
        /// <summary>
        /// This will get only global roles
        /// </summary>
        /// <returns></returns>
        public List<Model.RoleViewModel> GetAll()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Role roleSrv = new Service.Role(context);
            var list = roleSrv.GetAll();
            return list;
        }

        public List<Model.UserGroupRoleModel> GetUserGroups(Guid RoleGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Role roleSrv = new Service.Role(context);
            var list = roleSrv.GetUserGroups(RoleGUID);
            return list;
        }

        [HttpPost]
        public void DeleteUserGroup(Model.UserGroupRoleModel m)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Role roleSrv = new Service.Role(context);
            roleSrv.DeleteUserGroup(m.GUID);
        }

        [HttpPost]
        public void AddActiveDirectoryGroup(Model.RoleADGroupModel model)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Role roleSrv = new Service.Role(context);
            roleSrv.AddUserGroup(model);
        }
    }
}
