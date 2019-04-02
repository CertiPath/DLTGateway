using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;

namespace CertiPath.BlockchainGateway.Service
{
    public class Dashboard
    {
        public BasicStatsModel GetBasicStats()
        {
            DataModelContainer context = DataModelContainer.Builder().Build();

            // so people see daily counts for the timezone the server is in
            // may not be perfect, but better than matching just on UTC time
            TimeZone localZone = TimeZone.CurrentTimeZone;
            TimeSpan currentOffset = localZone.GetUtcOffset(DateTime.Now);
            var stats = context.GetSystemStats(currentOffset.Hours).SingleOrDefault();

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
        public Model.NamespaceTransactionsPerDayChart GetNamespaceTransactionsPerDay(int numberOfDays)
        {
            Model.NamespaceTransactionsPerDayChart res = new Model.NamespaceTransactionsPerDayChart();
            DataModelContainer context = DataModelContainer.Builder().Build();

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
            var transactions = context.vNamespaceTransactionsPerDay
                                            .AsNoTracking()
                                            .Where(w => w.TransactionDate >= queryFromDate)
                                            .ToList();

            var namespaces = transactions
                               .GroupBy(g => g.NamespaceGUID)
                               .Select(x => x.First())
                               .Distinct()
                               .ToList();

            int index = -1;
            Helper.Chart.ColorHelper ch = new Helper.Chart.ColorHelper();
            res.datasets = new List<NamespaceTranactionDataList>();
            foreach (var ns in namespaces)
            {
                index++;
                var data = new NamespaceTranactionDataList();
                data.label = ns.NamespaceName;
                data.backgroundColor = "rgba(" + ch.GetNextColor(index) + ", 0.65)";
                data.borderColor = "transparent";
                data.pointBackgroundColor = "#FFF";
                data.pointBorderColor = "rgba(" + ch.GetNextColor(index) + ", ,1)";
                data.pointHoverBackgroundColor = "rgba(" + ch.GetNextColor(index) + ", 1)";
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

            index++;
            var data2 = new NamespaceTranactionDataList();
            data2.label = "Second one";
            data2.backgroundColor = "rgba(" + ch.GetNextColor(index) + ", 0.65)";
            data2.borderColor = "transparent";
            data2.pointBackgroundColor = "#FFF";
            data2.pointBorderColor = "rgba(" + ch.GetNextColor(index) + ", 1)";
            data2.pointHoverBackgroundColor = "rgba" + ch.GetNextColor(index) + ", 1)";
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
            data3.backgroundColor = "rgba(" + ch.GetNextColor(index) + ", 0.65)";
            data3.borderColor = "transparent";
            data3.pointBackgroundColor = "#FFF";
            data3.pointBorderColor = "rgba(" + ch.GetNextColor(index) + ", 1)";
            data3.pointHoverBackgroundColor = "rgba(" + ch.GetNextColor(index) + ", 1)";
            data3.pointRadius = "5";
            data3.pointHoverBorderColor = "#FFF";
            data3.pointHoverRadius = "5";
            data3.pointBorderWidth = "2";
            data3.data = new List<int>();
            data3.data.AddRange(new List<int>() { 12, 26, 56, 62, 1, 23, 22 });
            res.datasets.Add(data3);

            return res;
        }
    }
}
