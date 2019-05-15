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
            var res = user.GetDetails();
            return res;
        }
        public List<Model.NotificationModel> GetNotifications()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.User user = new Service.User(context);
            var list = user.GetNotifications();
            return list;
        }
    }
}
