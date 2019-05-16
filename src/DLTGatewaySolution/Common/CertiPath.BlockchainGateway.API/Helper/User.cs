using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace CertiPath.BlockchainGateway.API.Helper
{
    internal class User
    {
        internal Model.AuthenticationResponseModel GetDetailsFromPrincipal()
        {
            Model.AuthenticationResponseModel m = new Model.AuthenticationResponseModel();
            ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
            if (null != principal)
            {
                foreach (Claim claim in principal.Claims)
                {
                    if (claim.Type.ToUpper() == "USER")
                    {
                        m = JsonConvert.DeserializeObject<Model.AuthenticationResponseModel>(claim.Value);
                        break;
                    }
                }
            }
            return m;
        }
    }
}