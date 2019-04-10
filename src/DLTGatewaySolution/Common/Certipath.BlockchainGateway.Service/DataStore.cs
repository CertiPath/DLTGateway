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
    }
}
