using System;
using System.Collections.Generic;

using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
namespace CertiPath.BlockchainGateway.Model
{
    #region Return Objects
    public enum ChartType
    {
        TIMELINE_LINE_STRAIGHT,
        TIMELINE_LINE_CURVED,
        TIMELINE_LINE_STRAIGHT_DASHED,
        TIMELINE_LINE_CURVED_DASHED,
        PIE_PIE,
        PIE_DONUT
    }

    public class ObjectChartReturnModel {
        public string ChartType { get; set; }
        public dynamic ChartData { get; set; }
    }
    #endregion

    #region Common Models

    #endregion


    #region Pie Chart Models
    public partial class PieChartModel
    {
        [JsonProperty("data")]
        public Data Data { get; set; }

        [JsonProperty("options")]
        public Options Options { get; set; }
    }

    public partial class Data
    {
        [JsonProperty("labels")]
        public List<string> Labels { get; set; }

        [JsonProperty("datasets")]
        public List<Dataset> Datasets { get; set; }
    }

    public partial class Dataset
    {
        [JsonProperty("data")]
        public List<long> Data { get; set; }

        [JsonProperty("backgroundColor")]
        public List<string> BackgroundColor { get; set; }
    }

    public partial class Options
    {
        [JsonProperty("animation")]
        public bool Animation { get; set; }

        [JsonProperty("responsive")]
        public bool Responsive { get; set; }

        [JsonProperty("maintainAspectRatio")]
        public bool MaintainAspectRatio { get; set; }
    }

    public partial class PieChartModel
    {
        public static PieChartModel FromJson(string json) => JsonConvert.DeserializeObject<PieChartModel>(json, CertiPath.BlockchainGateway.Model.Converter.Settings);
    }
    #endregion 

    #region Line Chart Models
    public partial class LineChartModel
    {
        [JsonProperty("data")]
        public LineChartData Data { get; set; }

        [JsonProperty("options")]
        public LineChartOptions Options { get; set; }
    }

    public partial class LineChartData
    {
        [JsonProperty("labels")]
        public List<string> Labels { get; set; }

        [JsonProperty("datasets")]
        public List<LineChartDataset> Datasets { get; set; }
    }

    public partial class LineChartDataset
    {
        [JsonProperty("data")]
        public List<long> Data { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

        [JsonProperty("fill")]
        public bool Fill { get; set; }

        [JsonProperty("borderDash", NullValueHandling = NullValueHandling.Ignore)]
        public List<long> BorderDash { get; set; }

        [JsonProperty("borderColor")]
        public string BorderColor { get; set; }

        [JsonProperty("pointBorderColor")]
        public string PointBorderColor { get; set; }

        [JsonProperty("pointBackgroundColor")]
        public string PointBackgroundColor { get; set; }

        [JsonProperty("pointBorderWidth")]
        public long PointBorderWidth { get; set; }

        [JsonProperty("pointHoverBorderWidth")]
        public long PointHoverBorderWidth { get; set; }

        [JsonProperty("pointRadius")]
        public long PointRadius { get; set; }

        [JsonProperty("lineTension", NullValueHandling = NullValueHandling.Ignore)]
        public long? LineTension { get; set; }
    }

    public partial class LineChartOptions
    {
        [JsonProperty("animation")]
        public Animation Animation { get; set; }

        [JsonProperty("hover")]
        public Hover Hover { get; set; }

        [JsonProperty("responsiveAnimationDuration")]
        public long ResponsiveAnimationDuration { get; set; }

        [JsonProperty("responsive")]
        public bool Responsive { get; set; }

        [JsonProperty("maintainAspectRatio")]
        public bool MaintainAspectRatio { get; set; }

        [JsonProperty("legend")]
        public Legend Legend { get; set; }

        [JsonProperty("scales")]
        public Scales Scales { get; set; }

        [JsonProperty("title")]
        public Title Title { get; set; }
    }

    public partial class Animation
    {
        [JsonProperty("duration")]
        public long Duration { get; set; }

        [JsonProperty("easing")]
        public string Easing { get; set; }
    }

    public partial class Hover
    {
        [JsonProperty("animationDuration")]
        public long AnimationDuration { get; set; }

        [JsonProperty("mode")]
        public string Mode { get; set; }
    }

    public partial class Legend
    {
        [JsonProperty("position")]
        public string Position { get; set; }
    }

    public partial class Scales
    {
        [JsonProperty("xAxes")]
        public List<Ax> XAxes { get; set; }

        [JsonProperty("yAxes")]
        public List<Ax> YAxes { get; set; }
    }

    public partial class Ax
    {
        [JsonProperty("display")]
        public bool Display { get; set; }

        [JsonProperty("gridLines")]
        public GridLines GridLines { get; set; }

        [JsonProperty("scaleLabel")]
        public ScaleLabel ScaleLabel { get; set; }
    }

    public partial class GridLines
    {
        [JsonProperty("color")]
        public string Color { get; set; }

        [JsonProperty("drawTicks")]
        public bool DrawTicks { get; set; }
    }

    public partial class ScaleLabel
    {
        [JsonProperty("display")]
        public bool Display { get; set; }

        [JsonProperty("labelString")]
        public string LabelString { get; set; }
    }

    public partial class Title
    {
        [JsonProperty("display")]
        public bool Display { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }
    }

    public partial class LineChartModel
    {
        public static LineChartModel FromJson(string json) => JsonConvert.DeserializeObject<LineChartModel>(json, CertiPath.BlockchainGateway.Model.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this LineChartModel self) => JsonConvert.SerializeObject(self, CertiPath.BlockchainGateway.Model.Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
    #endregion



}
