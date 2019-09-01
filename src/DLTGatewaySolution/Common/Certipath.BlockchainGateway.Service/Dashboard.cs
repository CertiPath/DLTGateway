using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Service.Helper.Chart;
using System.Data.Entity;

namespace CertiPath.BlockchainGateway.Service
{
    public class Dashboard
    {
        DataLayer.DataModelContainer _context;
        public Dashboard(DataLayer.DataModelContainer context)
        {
            _context = context;
        }
        public BasicStatsModel GetBasicStats(bool userCanViewAllNetworks, string userGroups)
        {
            // so people see daily counts for the timezone the server is in
            // may not be perfect, but better than matching just on UTC time
            TimeZone localZone = TimeZone.CurrentTimeZone;
            TimeSpan currentOffset = localZone.GetUtcOffset(DateTime.Now);
            var stats = _context.GetSystemStats(currentOffset.Hours, userGroups, userCanViewAllNetworks).SingleOrDefault();

            BasicStatsModel res = new BasicStatsModel() {
                CountAllTransactions = stats.CountAllTransactions,
                CountTransactionsToday = stats.CountTransactionsToday,
                NumberOfNetworks = stats.NumberOfNetworks,
                NumberOfObjectsTracked = stats.NumberOfObjectsTracked
            };
            return res;
        }


        /// <summary>
        ///  TODO: We should most likely be doing all this work on the front end and not here, but decided to save some time and do it on the backend
        /// </summary>
        /// <param name="numberOfDays"></param>
        /// <returns></returns>
        public Model.NamespaceTransactionsPerDayChart GetNamespaceTransactionsPerDay(int numberOfDays, bool userCanViewAllNetworks, string userGroups)
        {
            Model.NamespaceTransactionsPerDayChart res = new Model.NamespaceTransactionsPerDayChart();
            
            TimeZone localZone = TimeZone.CurrentTimeZone;
            TimeSpan currentOffset = localZone.GetUtcOffset(DateTime.Now);
            
            List<DateTime> dateList = new List<DateTime>();
            // get labels - days of the week
            res.labels = new List<string>();
            for (int i=0; i < numberOfDays; i++)
            {
                DateTime date = DateTime.Now.Date.AddDays(-1 * i);
                dateList.Insert(0, date);
                res.labels.Insert(0, date.DayOfWeek.ToString());
            }

            DateTime queryFromDate = DateTime.Today.AddDays(-1 * numberOfDays);

            List<vNamespaceTransactionsPerDay> transactions = new List<vNamespaceTransactionsPerDay>();
            var tempTransactions = _context.vNamespaceTransactionsPerDay
                                            .AsNoTracking()
                                            .Where(w => w.TransactionDate >= queryFromDate)
                                            .ToList();

            // exclude some transactions per day depending on user permissions
            if (userCanViewAllNetworks)
            {
                transactions = tempTransactions;
            }
            else
            {
                // get all user business networks
                var ubnList = _context.udfUserBusinessNetwork(userGroups, userCanViewAllNetworks).ToList();
                foreach (var transaction in tempTransactions)
                {
                    var match = ubnList.Where(w => w.GUID == transaction.BusinessNetworkGUID).SingleOrDefault();
                    if (match != null)
                    {
                        transactions.Add(transaction);
                    }
                }
            }

            var namespaces = transactions
                               .GroupBy(g => g.NamespaceGUID)
                               .Select(x => x.First())
                               .Distinct()
                               .ToList();

            int index = -1;
            res.datasets = new List<NamespaceTranactionDataList>();
            foreach (var ns in namespaces)
            {
                index++;
                var data = new NamespaceTranactionDataList();
                data.label = ns.NamespaceName;
                data.backgroundColor = ColorHelper.GetNextColorRgba(index, "0.65");
                data.borderColor = "transparent";
                data.pointBackgroundColor = "#FFF";
                data.pointBorderColor = ColorHelper.GetNextColorRgba(index, "1");
                data.pointHoverBackgroundColor = ColorHelper.GetNextColorRgba(index, "1");
                data.pointRadius = "5";
                data.pointHoverBorderColor = "#FFF";
                data.pointHoverRadius = "5";
                data.pointBorderWidth = "2";

                data.data = new List<int>();
                foreach (var date in dateList)
                {
                    var item = transactions
                                    .Where(w => w.NamespaceGUID == ns.NamespaceGUID)
                                    .Where(w => w.TransactionDate == date)
                                    .SingleOrDefault();

                    data.data.Add(item == null ? 0 : (int)item.TransactionCount);
                }
                res.datasets.Insert(0, data);
            }

            /*
            index++;
            var data2 = new NamespaceTranactionDataList();
            data2.label = "Second one";
            data2.backgroundColor = ColorHelper.GetNextColorRgba(index, "0.65");
            data2.borderColor = "transparent";
            data2.pointBackgroundColor = "#FFF";
            data2.pointBorderColor = ColorHelper.GetNextColorRgba(index, "1");
            data2.pointHoverBackgroundColor = ColorHelper.GetNextColorRgba(index, "1");
            data2.pointRadius = "5";
            data2.pointHoverBorderColor = "#FFF";
            data2.pointHoverRadius = "5";
            data2.pointBorderWidth = "2";
            data2.data = new List<int>();
            data2.data.AddRange(new List<int>() { 2, 56, 6, 22, 11, 17, 5 });
            res.datasets.Add(data2);

            index++;
            var data3 = new NamespaceTranactionDataList();
            data3.label = "Third one";
            data3.backgroundColor = ColorHelper.GetNextColorRgba(index, "0.65");
            data3.borderColor = "transparent";
            data3.pointBackgroundColor = "#FFF";
            data3.pointBorderColor = ColorHelper.GetNextColorRgba(index, "1");
            data3.pointHoverBackgroundColor = ColorHelper.GetNextColorRgba(index, "1");
            data3.pointRadius = "5";
            data3.pointHoverBorderColor = "#FFF";
            data3.pointHoverRadius = "5";
            data3.pointBorderWidth = "2";
            data3.data = new List<int>();
            data3.data.AddRange(new List<int>() { 12, 26, 56, 62, 1, 23, 22 });
            res.datasets.Add(data3);
            */

            return res;
        }
    }
}
