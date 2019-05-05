using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class ActiveDirectoryController : ApiController
    {
        [HttpGet]
        public List<LDAPGroupModel> GroupSearch(string Name)
        {
            LDAPConnectionModel connection = new LDAPConnectionModel() {
                Username = "",
                Password = "",
                Server = "trust-test.local",
                Port = 3268,
                BaseDirectory = "DC=TRUST-Test,DC=local",
                PageSize = 10,
                AuthType = "NTLM"
            };
            
            LDAP.Group ldapGroup = new LDAP.Group(connection, false);

            string filter = "(groupType:1.2.840.113556.1.4.803:=2147483648)";
            if (Name != null && Name.Trim() != "")
            {
                filter = "(&" + filter + "(cn=*" + Name.Trim() + "*))";
            }
            bool lEnd = false;
            List<LDAPGroupModel> list = ldapGroup.GetByFilter(filter, 1, 10, out lEnd);
            return list;
        }
    }
}