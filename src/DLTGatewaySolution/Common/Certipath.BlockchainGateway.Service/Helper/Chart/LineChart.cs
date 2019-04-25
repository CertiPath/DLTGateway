using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class LineChart
    {
        private DataLayer.DataModelContainer _context;

        public LineChart(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        internal ObjectChartReturnModel Build(Model.ChartType chartType, Guid dataStoreGUID, BusinessNetworkObjectChart chartDef)
        {
            Model.NetworkObjectChartSetting chartSettings = JsonConvert.DeserializeObject<Model.NetworkObjectChartSetting>(chartDef.ChartSettings);
            Helper.Chart.DataBuilderLineChart dataBuilder = new DataBuilderLineChart(_context);
            ObjectChartDataModel chartData = dataBuilder.Get(dataStoreGUID, chartDef, chartSettings);

            Model.LineChartModel model = new Model.LineChartModel();
            
            // Chart definition
            Model.LineChartData lineChart = new Model.LineChartData();
            lineChart.Labels = chartData.LabelList;
            lineChart.Datasets = new List<Model.LineChartDataset>();

            int index = -1;
            foreach (var series in chartData.SeriesList)
            {
                index++;
                lineChart.Datasets.Add(new Model.LineChartDataset()
                {
                    Data = series.DataList,
                    Label = series.Label,
                    LineTension = getLineTension(chartType),
                    Fill = false,
                    BorderDash = getBorderDash(chartType),
                    BorderColor = ColorHelper.GetNextColorRgba(index, "0.8"),
                    PointBorderColor = ColorHelper.GetNextColorRgba(index, "0.8"),
                    PointBackgroundColor = "#FFF",
                    PointBorderWidth = 2,
                    PointHoverBorderWidth = 2,
                    PointRadius = 4
                });
            }
            model.Data = lineChart;

            // options
            Model.LineChartOptions chartOptions = new Model.LineChartOptions();
            chartOptions.Animation = new Model.Animation() { Duration = 1000, Easing = "easeOutBack" };
            chartOptions.Hover = new Model.Hover() { AnimationDuration = 1000, Mode = "Label" };
            chartOptions.ResponsiveAnimationDuration = 1000;
            chartOptions.Responsive = true;
            chartOptions.MaintainAspectRatio = false;
            chartOptions.Legend = new Model.Legend() {
                Position = chartSettings.LegendLocation == null || chartSettings.LegendLocation == "" ? "bottom" : chartSettings.LegendLocation
            };
            chartOptions.Title = new Model.Title() {
                Display = chartSettings.Title == null || chartSettings.Title == "" ? false : true,
                Text = chartSettings.Title == null || chartSettings.Title == "" ? "" : chartSettings.Title };

            // options - scales
            chartOptions.Scales = new Model.Scales();
            chartOptions.Scales.XAxes = new List<Model.Ax>();
            if (chartSettings.XAxes != null)
            {
                chartOptions.Scales.XAxes.Add(new Model.Ax()
                {
                    Display = true,
                    GridLines = new Model.GridLines() { Color = "#f3f3f3", DrawTicks = false },
                    ScaleLabel = new Model.ScaleLabel()
                    {
                        Display = chartSettings.XAxes.Title == "" ? false : true,
                        LabelString = chartSettings.XAxes.Title
                    }
                });
            }

            chartOptions.Scales.YAxes = new List<Model.Ax>();
            if (chartSettings.YAxes != null)
            {
                chartOptions.Scales.YAxes.Add(new Model.Ax()
                {
                    Display = true,
                    GridLines = new Model.GridLines() { Color = "#f3f3f3", DrawTicks = false },
                    ScaleLabel = new Model.ScaleLabel()
                    {
                        Display = chartSettings.YAxes.Title == "" ? false : true,
                        LabelString = chartSettings.YAxes.Title
                    }
                });
            }
            model.Options = chartOptions;

            Model.ObjectChartReturnModel res = new Model.ObjectChartReturnModel();
            res.ChartData = model;
            res.ChartType = chartType.ToString();

            return res;
        }

        private List<long> getBorderDash(Model.ChartType chartType)
        {
            if (chartType == Model.ChartType.TIMELINE_LINE_CURVED_DASHED ||
                chartType == Model.ChartType.TIMELINE_LINE_STRAIGHT_DASHED)
            {
                return new List<long>() { 5, 5 };
            }
            return null;
        }

        private long? getLineTension(Model.ChartType chartType)
        {
            if (chartType == Model.ChartType.TIMELINE_LINE_STRAIGHT ||
                chartType == Model.ChartType.TIMELINE_LINE_STRAIGHT_DASHED)
            {
                return (long) 0;
            }
            return null;
        }
    }
}
