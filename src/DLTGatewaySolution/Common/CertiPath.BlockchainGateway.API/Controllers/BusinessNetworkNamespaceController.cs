using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;


namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class BusinessNetworkNamespaceController : ApiController
    {
        public List<BusinessNetworkNamespaceViewModel> GetAll(Guid BusinessNetworkGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(context);
            var res = bnn.GetAllByBusinessNetwork(BusinessNetworkGUID);
            return res;
        }

        public BusinessNetworkNamespaceModel GetDetails(Guid GUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(context);
            var res = bnn.GetDetails(GUID);
            return res;
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectModel obj)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(context);
            bnn.Delete(obj.GUID);
        }

        [HttpPost]
        public void Save(BusinessNetworkNamespaceViewModel obj)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(context);
            bnn.Save(obj);
        }

    }
}