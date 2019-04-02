using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class DashboardController : ApiController
    {
        public Model.BasicStatsModel GetBasicStats()
        {
            Service.Dashboard dashboardService = new Service.Dashboard();
            var res = dashboardService.GetBasicStats();
            return res;
        }

        public Model.NamespaceTransactionsPerDayChart GetNamespaceTransactionsPerDay()
        {
            Service.Dashboard dashboardService = new Service.Dashboard();
            var res = dashboardService.GetNamespaceTransactionsPerDay(7);
            return res;
        } 
    }
}
