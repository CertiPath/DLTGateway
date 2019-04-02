using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class BasicStatsModel
    {
        public Nullable<int> CountAllTransactions { get; set; }
        public Nullable<int> CountTransactionsToday { get; set; }
        public Nullable<int> NumberOfNetworks { get; set; }
        public Nullable<int> NumberOfObjectsTracked { get; set; }
    }

    public class NamespaceTransactionsPerDay
    {
        public System.Guid NamespaceGUID { get; set; }
        public string NamespaceName { get; set; }
        public Nullable<System.DateTime> TransactionDate { get; set; }
        public string TransactionDayName { get; set; }
        public Nullable<int> TransactionCount { get; set; }
    }

    public class NamespaceTransactionsPerDayChart
    {
        public List<string> labels { get; set; }
        public List<NamespaceTranactionDataList> datasets { get; set; }
    }
    public class NamespaceTranactionDataList
    {
        public List<int> data { get; set; }
        public string label { get; set; }
        public string backgroundColor { get; set; }
        public string borderColor { get; set; }
        public string pointBackgroundColor { get; set; }
        public string pointBorderColor { get; set; }
        public string pointHoverBackgroundColor { get; set; }
        public string pointRadius { get; set; }
        public string pointHoverBorderColor { get; set; }
        public string pointHoverRadius { get; set; }
        public string pointBorderWidth { get; set; }
    }
}
