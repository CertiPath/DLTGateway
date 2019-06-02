using CertiPath.BlockchainGateway.Model;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;

namespace CertiPath.BlockchainGateway.API.Auth
{
    public class WinAuthProvider : OwinMiddleware
    {
        public WinAuthProvider(OwinMiddleware next) : base(next) { }

        public override async Task Invoke(IOwinContext context)
        {
            WindowsPrincipal user = context.Request.User as WindowsPrincipal;
            WindowsIdentity identity = HttpContext.Current.User.Identity as WindowsIdentity;


            Helper.ActiveDirectory adh = new Helper.ActiveDirectory();
            DataLayer.DataModelContainer dbContext = DataLayer.DataModelContainer.Builder().Build();
            LDAPConnectionModel adConnection = adh.GetActiveDirectoryConnection(dbContext);
           
            LDAP.User ldap = new LDAP.User(adConnection);
            LDAPUserModel adUser = ldap.GetBySID(identity.User.ToString(), adConnection.BaseDirectory, true);

            // get security groups for this user
            var groups = adh.GetSecurityGroupsByDN(adUser.DistinguishedName);

            Helper.User userHelper = new Helper.User();
            var permissions = userHelper.GetPermissionsFromADGroups(dbContext, groups);


            string test = "";
            
          
        }
    }
}