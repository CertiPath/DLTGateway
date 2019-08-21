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

        public Model.UserModel FindByDomainAndUsername(string domain, string username)
        {
            var user = _context.User
                                .Where(w => w.Domain == domain)
                                .Where(w => w.Username == username)
                                .SingleOrDefault();

            if (user != null)
            {
                return new UserModel()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Notifications = GetNotifications(user.GUID),
                    Domain = user.Domain,
                    Username = user.Username
                };
            }
            return null;
        }

        public Model.UserModel CreateNew(Model.UserModel m)
        {
            DataLayer.User user = new DataLayer.User();
            user.GUID = Guid.NewGuid();
            user.Deleted = false;
            user.FirstName = m.FirstName == null ? "" : m.FirstName;
            user.LastName = m.LastName == null ? "" : m.LastName;
            user.Domain = m.Domain;
            user.Username = m.Username;
            user.Email = m.Email == null ? "" : m.Email;
            user.Password = "";

            m.GUID = user.GUID;
            _context.User.Add(user);
            _context.SaveChanges();
            return m;
        }
    }
}
