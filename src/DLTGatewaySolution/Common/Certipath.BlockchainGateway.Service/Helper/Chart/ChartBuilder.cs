﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class ChartBuilder
    {
        internal ObjectChartReturnModel Build(BusinessNetworkObjectChart chartDef)
        {
            ObjectChartReturnModel res = new ObjectChartReturnModel();
            switch (chartDef.ChartType.Code)
            {
                case Model.ChartType.timelineLine:
                    Helper.Chart.LineChart lineChart = new LineChart();
                    res = lineChart.Build(chartDef);
                    break;
                default:
                    throw new NotImplementedException();
            }
            return res;
        }
    }
}