using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace CertiPath.BlockchainGateway.API.Attributes
{
    public class SuperAdminAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            // for this purpose super admin and global admin is the same
            Helper.Claims claims = new Helper.Claims();
            bool isSuperAdmin = claims.isSuperAdmin();
            bool isGlobalAdmin = claims.isGlobalAdmin();
            if (isSuperAdmin == false && isGlobalAdmin == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_DENIED_SUPER_ADMIN);
            }
            base.OnActionExecuting(actionContext);
        }
    }
}