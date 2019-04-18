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
        private DataLayer.DataModelContainer _context;

        public DataStore(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        public Model.DataStoreModel Get(Guid objGUID)
        {
            var obj = _context.DataStore.Where(w => w.GUID == objGUID).SingleOrDefault();

            Helper.DataStore.Common dataStoreCommon = new Helper.DataStore.Common(_context);
            Model.DataStoreModel m = new Model.DataStoreModel()
            {
                GUID = obj.GUID,
                ObjectName = obj.BusinessNetworkObject.Name,
                SourceID = obj.SourceID,
                TransactionHistoryGUID = obj.TransactionHistoryGUID,
                PropertyValues = dataStoreCommon.Extract(obj.BusinessNetworkObjectGUID, obj.Value)
            };

            // get charts
            Helper.DataStore.ChartHelper chartHelper = new Helper.DataStore.ChartHelper();
            m.ChartList = chartHelper.GetByDataStoreGUID(obj.BusinessNetworkObjectGUID);

            return m;
        }

        public Model.DataStoreTableModel GetAll(Model.TableModel model)
        {
            List<Model.DataStoreViewModel> list = new List<Model.DataStoreViewModel>();
            
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

            var data = _context.vDataStore
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

            int totalCount = _context.vDataStore
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

        public Model.ObjectChartReturnModel GetChart(Guid dataStoreGUID, Guid objectChartGuid)
        {
            var chartDef = _context.BusinessNetworkObjectChart.Where(w => w.GUID == objectChartGuid).SingleOrDefault();
            Helper.Chart.ChartBuilder cb = new Helper.Chart.ChartBuilder(_context);
            Model.ObjectChartReturnModel res = cb.Build(dataStoreGUID, chartDef);
            return res;
        }
    }
}
