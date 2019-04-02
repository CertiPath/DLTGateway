using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;


namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class BusinessNetworkNamespaceController : ApiController
    {
        public List<BusinessNetworkNamespaceViewModel> GetAll(Guid BusinessNetworkGUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace();
            var res = bnn.GetAllByBusinessNetwork(BusinessNetworkGUID);
            return res;
        }

        public BusinessNetworkNamespaceModel GetDetails(Guid GUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace();
            var res = bnn.GetDetails(GUID);
            return res;
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace();
            bnn.Delete(obj.GUID);
        }

        [HttpPost]
        public void Save(BusinessNetworkNamespaceViewModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace();
            bnn.Save(obj);
        }

    }
}