using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class DataStoreTableModel
    {
        public int TotalCount { get; set; }
        public IEnumerable<Model.DataStoreViewModel> List { get; set; }
    }
    
    public class DataStoreViewModel
    {
        public System.Guid BusinessNetworkGUID { get; set; }
        public string BusinessNetworkName { get; set; }
        public System.Guid BusinessNetworkNamespaceGUID { get; set; }
        public string BusinessNetworkNamespaceName { get; set; }
        public System.Guid BusinessNetworkObjectGUID { get; set; }
        public string BusinessNetworkObjectClassName { get; set; }
        public string BusinessNetworkObjectName { get; set; }
        public System.Guid DataStoreGUID { get; set; }
        public bool DataStoreIsDeleted { get; set; }
        public string DataStoreSourceID { get; set; }
        public Nullable<System.DateTime> DataStoreLastUpdatedOn { get; set; }
    }

    public class DataStoreModel
    {
        public Guid GUID { get; set; }
        public string ObjectName { get; set; }
        public Guid? TransactionHistoryGUID { get; set; }
        public string SourceID { get; set; }
        public List<PropertyModel> PropertyValues { get; set; }
        public List<DataStoreChartModel> ChartList { get; set; }

    }

    public class PropertyModel
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class DataStoreChartModel
    {
        public Guid GUID { get; set; }
        public string Name { get; set; }
        public string TypeCode { get; set; }
        public string ChartData { get; set; }
    }
}
