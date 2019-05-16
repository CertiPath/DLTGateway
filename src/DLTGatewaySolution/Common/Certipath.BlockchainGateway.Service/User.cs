using CertiPath.BlockchainGateway.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;

namespace CertiPath.BlockchainGateway.Service
{
    public class User
    {
        private DataModelContainer _context;
        
        public User(DataModelContainer context)
        {
            _context = context;
        }

        public List<Model.NotificationModel> GetNotifications(Guid userGUID)
        {
            List<Model.NotificationModel> list = new List<NotificationModel>();
            Helper.Notification.NotificationHelper notification = new Helper.Notification.NotificationHelper(_context);

            list.AddRange(notification.GetGlobalSettings());
            list.AddRange(notification.GetBusinessNetworks());
            
            return list;
        }

        public Model.UserModel GetDetails(Guid userGUID)
        {
            var user = _context.User.Where(w => w.GUID == userGUID).SingleOrDefault();
            Model.UserModel res = new UserModel()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Notifications = GetNotifications(user.GUID)
            };
            return res;
        }
    }
}
