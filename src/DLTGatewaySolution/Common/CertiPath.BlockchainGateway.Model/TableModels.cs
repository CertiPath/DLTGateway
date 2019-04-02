using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class TableModel
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public List<TableFilterModel> FilterList { get; set; }
        public List<TableSortModel> SortList { get; set; }
    }

    public class TableFilterModel
    {
        public string id { get; set; }
        public string value { get; set; }
    }

    public class TableSortModel
    {
        public string id { get; set; }
        public string desc { get; set; }
    }
}
