using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class LineChart
    {
        internal ObjectChartReturnModel Build(BusinessNetworkObjectChart chartDef)
        {
            
            ObjectChartDataModel chartData = new ObjectChartDataModel();
            chartData.LabelList = new List<string>() { "January", "February", "March", "April", "May", "June", "July" };
            chartData.SeriesList = new List<ChartDataSeriesModel>();
            chartData.SeriesList.Add(new ChartDataSeriesModel()
            {
                DataList = new List<long>() { 65, 59, 80, 81, 56, 55, 40 },
                Label = "My First dataset",
            });
            chartData.SeriesList.Add(new ChartDataSeriesModel()
            {
                DataList = new List<long>() { 28, 48, 40, 19, 86, 27, 90 },
                Label = "My Second dataset",
            });

            
            Model.LineChartModel model = new Model.LineChartModel();
            ColorHelper colorHelper = new ColorHelper();

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
                    Fill = false,
                    BorderDash = new List<long>() { 5, 5 },
                    BorderColor = colorHelper.GetNextColor(index),
                    PointBorderColor = colorHelper.GetNextColor(index),
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
            res.ChartType = Model.ChartType.timelineLine;

            return res;
        }
    }
}
