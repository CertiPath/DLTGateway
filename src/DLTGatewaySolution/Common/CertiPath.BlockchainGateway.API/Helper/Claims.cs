using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace CertiPath.BlockchainGateway.API.Helper
{
    public class Claims
    {
        public static string IS_SUPER_ADMIN = "IsSuperAdmin";

        internal IEnumerable<Claim> GetAll()
        {
            ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
            if (null != principal)
            {
                return principal.Claims;
            }
            return null;
        }

        internal bool isSuperAdmin()
        {
            IEnumerable<Claim> claims = GetAll();
            string userValues = claims.Where(w => w.Type == "User").SingleOrDefault().Value;

            Model.AuthenticationResponseModel user = JsonConvert.DeserializeObject<Model.AuthenticationResponseModel>(userValues);
            return user.IsSuperAdmin;
        }

        internal bool isGlobalAdmin()
        {
            IEnumerable<Claim> claims = GetAll();
            string userValues = claims.Where(w => w.Type == "User").SingleOrDefault().Value;

            Model.AuthenticationResponseModel user = JsonConvert.DeserializeObject<Model.AuthenticationResponseModel>(userValues);
            return user.IsGlobalAdmin;
        }

        internal bool isGlobalView()
        {
            IEnumerable<Claim> claims = GetAll();
            string userValues = claims.Where(w => w.Type == "User").SingleOrDefault().Value;

            Model.AuthenticationResponseModel user = JsonConvert.DeserializeObject<Model.AuthenticationResponseModel>(userValues);
            return user.IsGlobalView;
        }

        internal string GetGroups()
        {
            IEnumerable<Claim> claims = GetAll();
            string userValues = claims.Where(w => w.Type == "User").SingleOrDefault().Value;

            Model.AuthenticationResponseModel user = JsonConvert.DeserializeObject<Model.AuthenticationResponseModel>(userValues);
            return user.Groups;
        }

    }
}