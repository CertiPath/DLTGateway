using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class UserController : ApiController
    {
        public Model.UserModel GetDetails()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.User user = new Service.User(context);
            Helper.User userHelper = new Helper.User();
            var authInfo = userHelper.GetDetailsFromPrincipal();
            var res = user.GetDetails(authInfo.GUID);
            return res;
        }
        public List<Model.NotificationModel> GetNotifications()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.User user = new Service.User(context);
            Helper.User userHelper = new Helper.User();
            var authInfo = userHelper.GetDetailsFromPrincipal();
            var list = user.GetNotifications(authInfo.GUID);
            return list;
        }
    }
}
