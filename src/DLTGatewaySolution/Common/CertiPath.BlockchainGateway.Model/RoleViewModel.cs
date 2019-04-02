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
    }
}
