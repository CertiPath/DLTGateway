﻿using System;
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
        internal List<DataStoreChartModel> GetByDataStoreGUID(Guid objectGUID)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            List<DataStoreChartModel> res = new List<DataStoreChartModel>();

            var charts = context.BusinessNetworkObjectChart
                                        .Where(w => w.BusinessNetworkObjectGUID == objectGUID)
                                        .OrderBy(O => O.SortOrder)
                                        .ToList();
            foreach (var chart in charts)
            {
                res.Add(new DataStoreChartModel()
                {
                    GUID = chart.GUID,
                    Name = chart.Name,
                    TypeCode = chart.ChartType.Code
                });
            }
            return res;
        }
    }
}