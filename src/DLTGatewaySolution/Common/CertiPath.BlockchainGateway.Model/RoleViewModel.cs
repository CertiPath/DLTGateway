using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class RoleTableModel
    {
        public int TotalCount { get; set; }
        public IEnumerable<RoleViewModel> List { get; set; }
    }

    public class RoleViewModel
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsSystemRole { get; set; }
        public string Code { get; set; }
    }

    public class UserGroupModel
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string SID { get; set; }
    }

    public class UserGroupRoleModel
    {
        public System.Guid GUID { get; set; }
        public Guid RoleGUID { get; set; }
        public Guid UserGroupGUID { get; set; }
        public string RoleName { get; set; }
        public string UserGroupName { get; set; }
        public string UserGroupSID { get; set; }
    }

    public class RoleADGroupModel
    {
        public Guid RoleGUID { get; set; }
        public Model.LDAPGroupModel Group { get; set; }
        public Guid? BusinessNetworkGUID { get; set; }
    }

    public class UserRoleNetworkModel
    {
        public Guid UserGUID { get; set; }
        public Guid BusinessNetworkGUID { get; set; }
        public Guid BusinessNetworkName { get; set; }
        public Guid RoleGUID { get; set; }
        public string RoleName { get; set; }
        public string RoleCode { get; set; }
    }
}
