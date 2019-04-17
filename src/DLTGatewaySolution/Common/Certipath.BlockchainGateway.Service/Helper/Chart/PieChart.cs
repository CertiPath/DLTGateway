using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class PieChart
    {
        internal ObjectChartReturnModel Build(Model.ChartType chartType, Guid dataStoreGUID, BusinessNetworkObjectChart chartDef)
        {
            /*
             * data: {
                  labels: ["Download Sales", "In-Store Sales", "Mail Sales"],
                  datasets: [
                     {
                        data: [300, 500, 100],
                        backgroundColor: [
                           "rgba(0, 157, 160, 0.8)",
                           "rgba(28, 188, 216, 0.8)",
                           "rgba(255, 141, 96, 0.8)"
                        ]
                     }
                  ]
               },
               options: {
                  animation: false,
                  responsive: true,
                  maintainAspectRatio: false
               }
               */
            ObjectChartReturnModel result = new ObjectChartReturnModel();
            Model.PieChartModel model = new PieChartModel();
            model.Data = new Data();
            model.Data.Labels = new List<string>() { "Download Sales", "In-Store Sales", "Mail Sales" };
            model.Data.Datasets = new List<Dataset>();

            ColorHelper color = new ColorHelper();
            model.Data.Datasets.Add(new Dataset()
            {
                Data = new List<long>() { 300, 500, 100 },
                BackgroundColor = new List<string>()
                {
                    "rgba(" + color.GetNextColor(0) + ", 0.8)",
                    "rgba(" + color.GetNextColor(1) + ", 0.8)",
                    "rgba(" + color.GetNextColor(2) + ", 0.8)"
                }
            });

            model.Options = new Options()
            {
                Animation = false,
                Responsive = true,
                MaintainAspectRatio = false
            };

            result.ChartType = "PIE_PIE";
            result.ChartData = model;
            return result;
        }
    }
}
