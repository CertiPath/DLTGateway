using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class CurrentContextModel
    {
        public DataLayer.DataModelContainer DatabaseContext { get; set; }
        public CurrentUserModel UserContext { get; set; }
    }

    public class CurrentUserModel
    {
        public Guid GUID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
