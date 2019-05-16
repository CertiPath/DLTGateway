using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Model;
using CertiPath.BlockchainGateway.DataLayer;

namespace CertiPath.BlockchainGateway.Service.Helper.DataStore
{
    internal class ChartHelper
    {
        DataLayer.DataModelContainer _context;
        internal ChartHelper(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        internal List<DataStoreChartModel> GetByBusinessNetworkObjectGUID(Guid objectGUID)
        {
            List<DataStoreChartModel> res = new List<DataStoreChartModel>();

            var charts = _context.BusinessNetworkObjectChart
                                        .Where(w => w.BusinessNetworkObjectGUID == objectGUID)
                                        .Where(w => w.Deleted == false)
                                        .Where(w => w.Disabled == false)
                                        .OrderBy(O => O.SortOrder)
                                        .ToList();
            foreach (var chart in charts)
            {
                res.Add(new DataStoreChartModel()
                {
                    GUID = chart.GUID,
                    Name = chart.Name,
                    Description = chart.Description,
                    TypeCode = chart.ChartType.Code
                });
            }
            return res;
        }
    }
}
