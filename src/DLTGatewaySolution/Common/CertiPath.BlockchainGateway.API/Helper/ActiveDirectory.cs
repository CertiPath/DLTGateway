using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace CertiPath.BlockchainGateway.API.Helper
{
    internal class ActiveDirectory
    {
        internal LDAPConnectionModel GetConnection()
        {
            LDAPConnectionModel connection = new LDAPConnectionModel();
            ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
            if (null != principal)
            {
                foreach (Claim claim in principal.Claims)
                {
                    if (claim.Type.ToUpper() == "ADCONNECTION")
                    {
                        connection = JsonConvert.DeserializeObject<LDAPConnectionModel>(claim.Value);
                        break;
                    }
                }
            }
            return connection;
        }
    }
}