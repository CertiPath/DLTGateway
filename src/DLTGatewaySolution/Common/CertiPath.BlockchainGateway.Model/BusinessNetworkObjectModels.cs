using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CertiPath.BlockchainGateway.Model
{
    public partial class BusinessNetworkObjectChartModel
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public System.Guid BusinessNetworkObjectGUID { get; set; }
        public string ChartSettings { get; set; }
        public int SortOrder { get; set; }
        public bool Disabled { get; set; }

        public System.Guid ChartCategoryGUID { get; set; }
        public string ChartCategoryCode { get; set; }
        public string ChartCategoryName { get; set; }
        public System.Guid ChartTypeGUID { get; set; }
        public string ChartTypeCode { get; set; }
        public string ChartTypeName { get; set; }
    }

    #region Object Chart Data
    public class ObjectChartDataModel
    {
        public List<string> LabelList { get; set; }
        public List<ChartDataSeriesModel> SeriesList { get; set; }
    }

    public class ChartDataSeriesModel
    {
        public List<long> DataList { get; set; }
        public string Label { get; set; }
    }
    #endregion

    #region Object Chart Settings
    public partial class NetworkObjectChartSetting
    {
        [JsonProperty("ChartTypeName")]
        public string ChartTypeName { get; set; }

        [JsonProperty("ChartTypeGUID")]
        public Guid ChartTypeGuid { get; set; }

        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("ShowGridlines")]
        public bool ShowGridlines { get; set; }
        [JsonProperty("LegendLocation")]
        public string LegendLocation { get; set; }

        [JsonProperty("XAxes")]
        public Axes XAxes { get; set; }

        [JsonProperty("YAxes")]
        public Axes YAxes { get; set; }

        [JsonProperty("Series")]
        public List<Series> Series { get; set; }
    }

    public partial class Series
    {
        [JsonProperty("Label")]
        public string Label { get; set; }

        [JsonProperty("ObjectPropertyName")]
        public string ObjectPropertyName { get; set; }

        [JsonProperty("ObjectPropertyGUID")]
        public Guid ObjectPropertyGuid { get; set; }

        [JsonProperty("LineType")]
        public string LineType { get; set; }

        [JsonProperty("Color")]
        public string Color { get; set; }
    }

    public partial class Axes
    {
        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("Category")]
        public string Category { get; set; }

        [JsonProperty("Type", NullValueHandling = NullValueHandling.Ignore)]
        public string Type { get; set; }

        [JsonProperty("Value")]
        public string Value { get; set; }

        [JsonProperty("YAxesType", NullValueHandling = NullValueHandling.Ignore)]
        public string YAxesType { get; set; }
    }

    public partial class NetworkObjectChartSetting
    {
        public static NetworkObjectChartSetting FromJson(string json) => JsonConvert.DeserializeObject<NetworkObjectChartSetting>(json, CertiPath.BlockchainGateway.Model.Converter.Settings);
    }
    #endregion
}
