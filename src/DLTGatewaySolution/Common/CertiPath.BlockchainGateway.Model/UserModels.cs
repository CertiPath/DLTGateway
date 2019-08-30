using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class UserModel
    {
        public Guid GUID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Domain { get; set; }
        public string Username { get; set; }
        public DateTime? LastLogin { get; set; }

        public bool IsSuperAdmin { get; set; }
        public bool IsGlobalAdmin { get; set; }
        public bool IsGlobalView { get; set; }


        public List<UserAdGroupModel> Groups { get; set; }
        public List<Model.NotificationModel> Notifications { get; set; }
    }

    public class UserTableModel
    {
        public int TotalCount { get; set; }
        public IEnumerable<Model.UserModel> List { get; set; }
    }

    public class UserAdGroupModel
    {
        public string SamAccountName { get; set; }
        public string DistinguishedName { get; set; }
        public string Sid { get; set; }
        public string Name { get; set; }
    }
}