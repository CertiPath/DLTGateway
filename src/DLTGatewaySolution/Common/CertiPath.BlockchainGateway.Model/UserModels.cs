using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class UserModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<Model.NotificationModel> Notifications { get; set; }
    }
}