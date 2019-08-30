using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class AuthenticationModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class AuthenticationResponseModel
    {
        public Guid GUID { get; set; }
        public bool IsAuthenticated { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }

        public bool IsSuperAdmin { get; set; }
        public bool IsGlobalAdmin { get; set; }
        public bool IsGlobalView { get; set; }
    }
}
