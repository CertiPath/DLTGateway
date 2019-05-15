using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public enum NotificationType
    {
        Info,
        Warning,
        Error
    }

    public class NotificationModel
    {
        public NotificationType Type { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string DateTime { get; set; }
        
    }
}
