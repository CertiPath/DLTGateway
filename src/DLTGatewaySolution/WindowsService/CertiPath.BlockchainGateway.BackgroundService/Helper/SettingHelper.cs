using CertiPath.BlockchainGateway.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.BackgroundService.Helper
{
    internal class SettingHelper
    {
        private DataModelContainer _context;
        
        public SettingHelper(DataModelContainer context)
        {
            _context = context;
        }
        public int GetTransactionHistoryJobTimeout()
        {
            Service.Settings settingService = new Service.Settings(_context);
            var gs = settingService.Get(Model.GlobalSetting.BACKGROUND_TRANSHISTORY_TIMEOUT);
            int timeoutInSeconds = 15;
            if (gs == null)
            {
                Log.Info(String.Format(
                    "GetTransactionHistoryJobTimeout - value not found in the database. Assigning default value of {0} seconds", timeoutInSeconds.ToString()));
            }
            else
            {
                timeoutInSeconds = Convert.ToInt32(gs.Value);
                Log.Info(String.Format(
                        "GetTransactionHistoryJobTimeout setting retrieved: {0} seconds", timeoutInSeconds.ToString()));
            }
            return timeoutInSeconds;
        }
    }
}
