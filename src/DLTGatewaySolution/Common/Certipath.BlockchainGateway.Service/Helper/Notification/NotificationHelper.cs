using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.Notification
{
    internal class NotificationHelper
    {
        private DataModelContainer _context;
        public NotificationHelper(DataModelContainer context)
        {
            _context = context;
        }

        internal List<NotificationModel> GetGlobalSettings()
        {
            // TODO - must consider user roles and if they have rights to deal with settings or not
            // check if there are any global settings that are required, but missing
            List<NotificationModel> list = new List<NotificationModel>();
            int missingCount = _context.Setting
                                        .Where(w => w.SettingType.UserEditable == true)
                                        .Where(w => w.UserEditable == true)
                                        .Where(w => w.Required == true)
                                        .Where(w => w.Value == "")
                                        .Count();
            if (missingCount > 0)
            {
                list.Add(new NotificationModel()
                {
                    Type = NotificationType.Warning.ToString(),
                    Title = "Required Settings",
                    DateTime = "",
                    Text = String.Format("There {1} {0} global setting{2} that {1} required, but missing.", 
                                    missingCount.ToString(),
                                    missingCount == 1 ? "is" : "are",
                                    missingCount == 1 ? "" : "s")
                });
            }
            return list;
        }

        internal List<NotificationModel> GetBusinessNetworks()
        {
            // TODO - must consider global/local admin roles here
            // check for business networks that are disabled
            List<NotificationModel> list = new List<NotificationModel>();
            int disabledCount = _context.BusinessNetwork
                                        .Where(w => w.Deleted == false)
                                        .Where(w => w.Disabled == true)
                                        .Count();
            if (disabledCount > 0)
            {
                list.Add(new NotificationModel()
                {
                    Type = NotificationType.Info.ToString(),
                    Title = "Disabled Networks",
                    DateTime = "",
                    Text = String.Format("There {1} {0} business network{2} that {1} disabled and that you can administer.", 
                                        disabledCount.ToString(),
                                        disabledCount == 1 ? "is" : "are",
                                        disabledCount == 1 ? "" : "s")
                });
            }
            return list;
        }
    }
}
