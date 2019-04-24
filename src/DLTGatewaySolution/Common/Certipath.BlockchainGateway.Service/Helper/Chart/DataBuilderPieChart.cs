using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class DataBuilderPieChart
    {
        private DataModelContainer _context;

        public DataBuilderPieChart(DataModelContainer context)
        {
            _context = context;
        }

        internal Model.PieChartModel Get(Guid dataStoreGUID, BusinessNetworkObjectChart chartDef, NetworkObjectChartSetting chartSettings)
        {
            Model.PieChartModel model = new PieChartModel();
            
            // pie charts - for now always look only at the current values
            var obj = _context.DataStore.Where(w => w.GUID == dataStoreGUID).SingleOrDefault();

            // for this chart type take datetime/strings as points
            model.Data = new Data()
            {
                Datasets = new List<Dataset>(),
                Labels = new List<string>()
            };
            model.Data.Datasets.Add(new Dataset() { BackgroundColor = new List<string>(), Data = new List<long>() });

            Helper.DataStore.Common dataStoreCommon = new DataStore.Common(_context);
            List<Model.PropertyModel> propertyValues = dataStoreCommon.Extract(chartDef.BusinessNetworkObjectGUID, obj.Value);
            int counter = -1;
            foreach (var series in chartSettings.Series)
            {
                foreach (var property in propertyValues)
                {
                    // TODO: Matching on Name/string?
                    if (series.ObjectPropertyName.ToUpper().Trim() == property.Name.ToUpper().Trim())
                    {
                        counter++;
                        model.Data.Labels.Add(property.Name);
                        model.Data.Datasets[0].BackgroundColor.Add(ColorHelper.GetNextColorRgba(counter, "0.8"));
                        model.Data.Datasets[0].Data.Add(Convert.ToInt64(property.Value));
                    }
                }
            }
            return model;
        }
    }
}
