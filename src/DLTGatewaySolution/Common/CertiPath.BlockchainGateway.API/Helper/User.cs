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

        internal List<Model.UserRoleNetworkModel> GetPermissionsFromADGroups(DataLayer.DataModelContainer context, List<Model.LDAPGroupModel> adGroups)
        {
            List<Model.UserRoleNetworkModel> result = new List<Model.UserRoleNetworkModel>();
            var roles = context.Role.ToList();

            // 1. figure out if global admin, if so nothing else needs to be calculated
            // this user will have permissions to everything
            bool lGlobalAdmin = groupRoleMatchExists(context, Helper.Role.GlobalAdmin, roles, adGroups);
            if (lGlobalAdmin)
            {
                result.Add(new Model.UserRoleNetworkModel()
                {
                    RoleCode = Helper.Role.GlobalAdmin
                });
            }
            
            // further calculations only needed if not global admin
            if (lGlobalAdmin == false)
            {
                // 2. GlobalView - if global view there is no need to calculate local view logic
                bool lGlobalView = groupRoleMatchExists(context, Helper.Role.GlobalView, roles, adGroups);
                if (lGlobalAdmin)
                {
                    result.Add(new Model.UserRoleNetworkModel()
                    {
                        RoleCode = Helper.Role.GlobalView
                    });
                }

                // 3. Get Local Admins

                // 4. Get Local View, but only if not global view
                if (lGlobalView == false)
                {

                }
            }
            return result;
        }

        private bool groupRoleMatchExists(DataLayer.DataModelContainer context, string roleCode, List<DataLayer.Role> roles, List<Model.LDAPGroupModel> adGroups)
        {
            var role = roles.Where(w => w.Code == roleCode).SingleOrDefault();
            var roleGroupList = context.Role_UserGroup.Where(w => w.RoleGUID == role.GUID).ToList();
            foreach (var roleGroup in roleGroupList)
            {
                var group = adGroups.Where(w => w.SID.ToUpper() == roleGroup.UserGroup.SID.ToUpper()).SingleOrDefault();
                if (group != null)
                {
                    // match found 
                    return true;
                }
            }
            return false;
        }
    }
}