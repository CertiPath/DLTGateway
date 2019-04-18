using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class PieChart
    {
        private DataModelContainer _context;

        public PieChart(DataModelContainer context)
        {
            _context = context;
        }

        internal ObjectChartReturnModel Build(Model.ChartType chartType, Guid dataStoreGUID, BusinessNetworkObjectChart chartDef)
        {
            ObjectChartReturnModel result = new ObjectChartReturnModel();
            Model.NetworkObjectChartSetting chartSettings = JsonConvert.DeserializeObject<Model.NetworkObjectChartSetting>(chartDef.ChartSettings);
            Helper.Chart.DataBuilderPieChart dataBuilder = new DataBuilderPieChart(_context);
            PieChartModel model = dataBuilder.Get(dataStoreGUID, chartDef, chartSettings);
            
            model.Options = new Options()
            {
                Animation = false,
                Responsive = true,
                MaintainAspectRatio = false
            };

            result.ChartType = chartType.ToString();
            result.ChartData = model;
            return result;
        }
    }
}
