using CertiPath.BlockchainGateway.API.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class UserController : BaseController
    {
        public Model.UserModel GetDetails()
        {
            Service.User user = new Service.User(DatabaseContext);
            Helper.User userHelper = new Helper.User();
            var authInfo = userHelper.GetDetailsFromPrincipal();
            var res = user.GetDetails(authInfo.GUID);

            // set is super admin
            Helper.Claims claims = new Helper.Claims();
            res.IsSuperAdmin = claims.isSuperAdmin();
            res.IsGlobalAdmin = claims.isGlobalAdmin();
            res.IsGlobalView = claims.isGlobalView();

            return res;
        }
        public List<Model.NotificationModel> GetNotifications()
        {
            Service.User user = new Service.User(DatabaseContext);
            Helper.User userHelper = new Helper.User();
            var authInfo = userHelper.GetDetailsFromPrincipal();
            var list = user.GetNotifications(authInfo.GUID);
            return list;
        }

        [SuperAdmin]
        [HttpPost]
        public Model.UserTableModel GetAll([FromBody]Model.TableModel model)
        {
            CertiPath.BlockchainGateway.Service.User userService = new Service.User(DatabaseContext);
            var list = userService.GetAll(model);
            return list;
        }
    }
}
