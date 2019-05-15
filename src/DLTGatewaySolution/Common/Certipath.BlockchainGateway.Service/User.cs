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

        public List<Model.NotificationModel> GetNotifications()
        {
            List<Model.NotificationModel> list = new List<NotificationModel>();
            list.Add(new NotificationModel()
            {
                Type = NotificationType.Warning,
                DateTime = "",
                Text = "Some sample text",
                Title = "Missing setting"
            });
            return list;
        }

        public Model.UserModel GetDetails()
        {
            Model.UserModel user = new UserModel()
            {
                FirstName = "NDDD",
                LastName = "TestLast",
                Notifications = GetNotifications()
            };
            return user;
        }
    }
}
