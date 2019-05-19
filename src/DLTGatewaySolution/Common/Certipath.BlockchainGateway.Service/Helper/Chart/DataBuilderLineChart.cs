using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class DataBuilderLineChart
    {
        private DataLayer.DataModelContainer _context;

        public DataBuilderLineChart(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        internal ObjectChartDataModel Get(Guid dataStoreGUID, BusinessNetworkObjectChart chartDef, NetworkObjectChartSetting chartSettings)
        {
            ObjectChartDataModel chartData = new ObjectChartDataModel();
            
            // hardcode for number of records at first
            // 1. get the objects in questions
            int numOfRecords = Convert.ToInt32(chartSettings.XAxes.Value);
            var historyList = _context.DataStoreHistory
                    .Where(w => w.DataStoreGUID == dataStoreGUID)
                    .OrderByDescending(o => o.CreatedOn)
                    .Take(numOfRecords)
                    .ToList();

            // for this chart type take datetime/strings as points
            chartData.LabelList = new List<string>();
            chartData.SeriesList = new List<ChartDataSeriesModel>();

            Helper.DataStore.Common dataStoreCommon = new DataStore.Common(_context);
            foreach (var record in historyList)
            {
                chartData.LabelList.Add(record.CreatedOn.ToShortDateString() + " " + record.CreatedOn.ToShortTimeString());

                string objectValue = record.Value;
                
                // TODO: extract keeps querying for each element in the list. this must be changed/improved
                List<Model.PropertyModel> propertyValues = dataStoreCommon.Extract(chartDef.BusinessNetworkObjectGUID, objectValue);

                foreach (var series in chartSettings.Series)
                {
                    foreach (var property in propertyValues)
                    {
                        // TODO: Matching on Name/string?
                        if (series.ObjectPropertyName.ToUpper().Trim() == property.Name.ToUpper().Trim())
                        {
                            // TODO: see above
                            var seriesItem = chartData.SeriesList.Where(w => w.Label == property.Name).SingleOrDefault();
                            if (seriesItem == null)
                            {
                                seriesItem = new ChartDataSeriesModel()
                                {
                                    Label = property.Name,
                                    DataList = new List<long>()
                                };
                                chartData.SeriesList.Add(seriesItem);
                            }
                            seriesItem.DataList.Add(Convert.ToInt32(property.Value));
                        }
                    }
                }
            }
            return chartData;
        }
    }
}
