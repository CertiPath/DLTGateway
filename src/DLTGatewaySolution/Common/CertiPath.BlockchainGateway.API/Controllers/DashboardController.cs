using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class DashboardController : BaseController
    {
        public Model.BasicStatsModel GetBasicStats()
        {
            Helper.Claims claims = new Helper.Claims();
            bool canViewAllNetworks = claims.isGlobalAdmin() || claims.isGlobalView() || claims.isSuperAdmin();
            string userGroups = claims.GetGroups();

            Service.Dashboard dashboardService = new Service.Dashboard(DatabaseContext);
            var res = dashboardService.GetBasicStats(canViewAllNetworks, userGroups);
            return res;
        }

        public Model.NamespaceTransactionsPerDayChart GetNamespaceTransactionsPerDay()
        {
            Helper.Claims claims = new Helper.Claims();
            bool canViewAllNetworks = claims.isGlobalAdmin() || claims.isGlobalView() || claims.isSuperAdmin();
            string userGroups = claims.GetGroups();

            Service.Dashboard dashboardService = new Service.Dashboard(DatabaseContext);
            var res = dashboardService.GetNamespaceTransactionsPerDay(7, canViewAllNetworks, userGroups);
            return res;
        } 
    }
}
