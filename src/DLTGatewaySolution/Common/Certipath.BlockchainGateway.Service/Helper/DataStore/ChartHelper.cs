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
        internal List<DataStoreChartModel> GetByDataStoreGUID(Guid GUID)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            List<DataStoreChartModel> res = new List<DataStoreChartModel>();

            // TODO - remove dummy data
            res.Add(new DataStoreChartModel()
            {
                Name = "Temperature/Humidity 24 Hours",
                GUID = Guid.NewGuid(),
                TypeCode = "LINE"
            });
            res.Add(new DataStoreChartModel()
            {
                Name = "T/H Pie Chart",
                GUID = Guid.NewGuid(),
                TypeCode = "LINE"
            });
            res.Add(new DataStoreChartModel()
            {
                Name = "Some Other Chart",
                GUID = Guid.NewGuid(),
                TypeCode = "LINE"
            });
            return res;
        }
    }
}
