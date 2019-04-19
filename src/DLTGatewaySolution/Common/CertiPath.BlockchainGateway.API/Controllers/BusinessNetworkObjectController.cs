using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class BusinessNetworkObjectController : ApiController
    {
        public List<BusinessNetworkObjectViewModel> GetAllByNamespace(Guid BusinessNetworkNamespaceGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bnn = new Service.BusinessNetworkObject(context);
            var res = bnn.GetDetailsByNamespace(BusinessNetworkNamespaceGUID);
            return res;
        }

        [HttpPost]
        public void Save(BusinessNetworkObjectViewModel obj)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(context);
            bno.Save(obj);
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectViewModel obj)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(context);
            bno.Delete(obj);
        }

        public BusinessNetworkObjectDetailsModel GetDetails(Guid BusinessNetworkObjectGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(context);
            var res = bno.GetDetails(BusinessNetworkObjectGUID);
            return res;
        }

        [HttpPost]
        public void SaveProperty(BusinessNetworkObjectPropertyModel obj)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(context);
            bno.SaveProperty(obj);
        }

        [HttpPost]
        public void DeleteProperty(BusinessNetworkObjectPropertyModel obj)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(context);
            bno.DeleteProperty(obj);
        }

        public List<BusinessNetworkObjectChartModel> GetCharts(Guid BusinessNetworkObjectGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(context);
            var res = bno.GetCharts(BusinessNetworkObjectGUID);
            return res;
        }
    }

}