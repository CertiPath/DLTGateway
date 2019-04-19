using System;
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
        private DataModelContainer _context;

        public ChartBuilder(DataModelContainer context)
        {
            _context = context;
        }

        internal ObjectChartReturnModel Build(Guid dataStoreGUID, BusinessNetworkObjectChart chartDef)
        {
            ObjectChartReturnModel res = new ObjectChartReturnModel();
            string fullyQualifyingName = String.Format("{0}_{1}", 
                                                chartDef.ChartType.ChartCategory.Code.Trim(),
                                                chartDef.ChartType.Code.Trim());

            Model.ChartType chartType;
            Model.ChartType.TryParse(fullyQualifyingName, out chartType);

            switch (chartType)
            {
                case Model.ChartType.TIMELINE_LINE_STRAIGHT:
                case Model.ChartType.TIMELINE_LINE_CURVED:
                case Model.ChartType.TIMELINE_LINE_STRAIGHT_DASHED:
                case Model.ChartType.TIMELINE_LINE_CURVED_DASHED:
                    Helper.Chart.LineChart lineChart = new LineChart(_context);
                    res = lineChart.Build(chartType, dataStoreGUID, chartDef);
                    break;
                case Model.ChartType.PIE_PIE:
                case Model.ChartType.PIE_DONUT:
                    Helper.Chart.PieChart pieChart = new Chart.PieChart(_context);
                    res = pieChart.Build(chartType, dataStoreGUID, chartDef);
                    break;
                default:
                    throw new NotImplementedException();
            }
            return res;
        }
    }
}
