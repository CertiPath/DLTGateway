using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Dynamic;

namespace CertiPath.BlockchainGateway.Service
{
    public class DataStore
    {
        public Model.DataStoreModel Get(Guid objGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            var obj = context.DataStore.Where(w => w.GUID == objGUID).SingleOrDefault();

            Model.DataStoreModel m = new Model.DataStoreModel()
            {
                GUID = obj.GUID,
                ObjectName = obj.BusinessNetworkObject.Name,
                SourceID = obj.SourceID,
                TransactionHistoryGUID = obj.TransactionHistoryGUID,
                PropertyValues = Helper.DataStore.Common.Extract(obj.BusinessNetworkObjectGUID, obj.Value)
            };

            // get charts
            Helper.DataStore.ChartHelper chartHelper = new Helper.DataStore.ChartHelper();
            m.ChartList = chartHelper.GetByDataStoreGUID(objGUID);

            return m;
        }

        public Model.DataStoreTableModel GetAll(Model.TableModel model)
        {
            List<Model.DataStoreViewModel> list = new List<Model.DataStoreViewModel>();
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();

            bool lFilter = model.FilterList.Count > 0;
            bool lFilterOnObjectName = false;
            bool lFilterOnSourceID = false;
            bool lFilterOnNamespace = false;

            string objectName = "";
            string sourceID = "";
            string namespaceName = "";

            if (lFilter)
            {
                foreach (var filter in model.FilterList)
                {
                    if (filter.id == "BusinessNetworkObjectName")
                    {
                        lFilterOnObjectName = true;
                        objectName = filter.value;
                    }
                    if (filter.id == "DataStoreSourceID")
                    {
                        lFilterOnSourceID = true;
                        sourceID = filter.value;
                    }
                    if (filter.id == "BusinessNetworkNamespaceName")
                    {
                        lFilterOnNamespace = true;
                        namespaceName = filter.value;
                    }
                }
            }

            string sortBy = "DataStoreLastUpdatedOn DESC";
            if (model.SortList.Count > 0)
            {
                sortBy = model.SortList[0].id + " "  + (Convert.ToBoolean(model.SortList[0].desc) ? "DESC" : "ASC");
            }

            var data = context.vDataStore
                            .Where(w => 
                                (lFilter == false) ||
                                (
                                    (lFilterOnObjectName == false || w.BusinessNetworkObjectName.Contains(objectName)) &&
                                    (lFilterOnSourceID == false || w.DataStoreSourceID.Contains(sourceID)) &&
                                    (lFilterOnNamespace == false || w.BusinessNetworkNamespaceName.Contains(namespaceName))
                                )
                                )
                            .AsQueryable().OrderBy(sortBy)
                             //.OrderByDescending(o => o.DataStoreLastUpdatedOn)
                            .Skip(model.PageNumber * model.PageSize)
                            .Take(model.PageSize)
                            .ToList();

            int totalCount = context.vDataStore
                            .Where(w =>
                                (lFilter == false) ||
                                (
                                    (lFilterOnObjectName == false || w.BusinessNetworkObjectName.Contains(objectName)) &&
                                    (lFilterOnSourceID == false || w.DataStoreSourceID.Contains(sourceID)) &&
                                    (lFilterOnNamespace == false || w.BusinessNetworkNamespaceName.Contains(namespaceName))
                                )
                                )
                                .Count();

            foreach (var item in data)
            {
                list.Add(new Model.DataStoreViewModel()
                {
                    DataStoreGUID = item.DataStoreGUID,
                    DataStoreSourceID = item.DataStoreSourceID,
                    BusinessNetworkObjectName = item.BusinessNetworkObjectName,
                    BusinessNetworkName = item.BusinessNetworkName,
                    BusinessNetworkNamespaceName = item.BusinessNetworkNamespaceName
                });
            }
            Model.DataStoreTableModel result = new Model.DataStoreTableModel()
            {
                List = list,
                TotalCount = totalCount
            };
            return result;
        }

        public Model.ObjectChartReturnModel GetChart(Guid objectChartGuid)
        {
            Model.LineChartModel model = new Model.LineChartModel();
            // Chart definition
            Model.LineChartData lineChart = new Model.LineChartData();
            lineChart.Labels = new List<string>() { "January", "February", "March", "April", "May", "June", "July" };
            lineChart.Datasets = new List<Model.LineChartDataset>();
            lineChart.Datasets.Add(new Model.LineChartDataset()
            {
                Data = new List<long>() { 65, 59, 80, 81, 56, 55, 40 },
                Label = "My First dataset",
                Fill = false,
                BorderDash = new List<long>() { 5, 5 },
                BorderColor = "#9C27B0",
                PointBorderColor = "#9C27B0",
                PointBackgroundColor = "#FFF",
                PointBorderWidth = 2,
                PointHoverBorderWidth = 2,
                PointRadius = 4
            });
            lineChart.Datasets.Add(new Model.LineChartDataset()
            {
                Data = new List<long>() { 28, 48, 40, 19, 86, 27, 90 },
                Label = "My Second dataset",
                Fill = false,
                //BorderDash = new List<long>() { 5, 5 },
                BorderColor = "#00A5A8",
                PointBorderColor = "#00A5A8",
                PointBackgroundColor = "#FFF",
                PointBorderWidth = 2,
                PointHoverBorderWidth = 2,
                PointRadius = 4
            });
            lineChart.Datasets.Add(new Model.LineChartDataset()
            {
                Data = new List<long>() { 45, 25, 16, 36, 67, 18, 76 },
                Label = "My Third dataset",
                LineTension = 0,
                Fill = false,
                BorderDash = new List<long>() { 5, 5 },
                BorderColor = "#FF7D4D",
                PointBorderColor = "#FF7D4D",
                PointBackgroundColor = "#FFF",
                PointBorderWidth = 2,
                PointHoverBorderWidth = 2,
                PointRadius = 4
            });
            model.Data = lineChart;

            // options
            Model.LineChartOptions chartOptions = new Model.LineChartOptions();
            chartOptions.Animation = new Model.Animation() { Duration = 1000, Easing = "easeOutBack" };
            chartOptions.Hover = new Model.Hover() { AnimationDuration = 1000, Mode = "Label" };
            chartOptions.ResponsiveAnimationDuration = 1000;
            chartOptions.Responsive = true;
            chartOptions.MaintainAspectRatio = false;
            chartOptions.Legend = new Model.Legend() { Position = "bottom" };
            chartOptions.Title = new Model.Title() { Display = true, Text = "My chaaaaaaartttt" };
            
            // options - scales
            chartOptions.Scales = new Model.Scales();
            chartOptions.Scales.XAxes = new List<Model.Ax>();
            chartOptions.Scales.XAxes.Add(new Model.Ax()
            {
                Display = true,
                GridLines = new Model.GridLines() { Color = "#f3f3f3", DrawTicks = false },
                ScaleLabel = new Model.ScaleLabel() { Display = true, LabelString = "Month" }
            });
            chartOptions.Scales.YAxes = new List<Model.Ax>();
            chartOptions.Scales.YAxes.Add(new Model.Ax()
            {
                Display = true,
                GridLines = new Model.GridLines() { Color = "#f3f3f3", DrawTicks = false },
                ScaleLabel = new Model.ScaleLabel() { Display = true, LabelString = "Value" }
            });
            model.Options = chartOptions;
            
            Model.ObjectChartReturnModel res = new Model.ObjectChartReturnModel();
            res.ChartData = model;
            res.ChartType = Model.ChartType.LINE_STRAIGHT;
            return res;
        }
    }
}
