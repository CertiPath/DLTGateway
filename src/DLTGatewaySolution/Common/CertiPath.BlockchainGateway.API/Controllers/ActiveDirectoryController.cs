using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class ActiveDirectoryController : BaseController
    {
        [HttpGet]
        public List<LDAPGroupModel> GroupSearch(string Name)
        {
            Helper.ActiveDirectory ad = new Helper.ActiveDirectory();
            LDAPConnectionModel connection = ad.GetConnection();
            LDAP.Group ldapGroup = new LDAP.Group(connection);

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