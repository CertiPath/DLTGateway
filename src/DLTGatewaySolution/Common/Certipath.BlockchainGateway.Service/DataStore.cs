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
            m.ChartList = chartHelper.GetByDataStoreGUID(obj.BusinessNetworkObjectGUID);

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
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            var chartDef = context.BusinessNetworkObjectChart.Where(w => w.GUID == objectChartGuid).SingleOrDefault();
            Helper.Chart.ChartBuilder cb = new Helper.Chart.ChartBuilder();
            Model.ObjectChartReturnModel res = cb.Build(chartDef);
            return res;
        }
    }
}
