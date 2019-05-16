using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
     public class BusinessNetworkNamespaceController : BaseController
     {
        public List<BusinessNetworkNamespaceViewModel> GetAll(Guid BusinessNetworkGUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            var res = bnn.GetAllByBusinessNetwork(BusinessNetworkGUID);
            return res;
        }

        public BusinessNetworkNamespaceModel GetDetails(Guid GUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            var res = bnn.GetDetails(GUID);
            return res;
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            bnn.Delete(obj.GUID);
        }

        [HttpPost]
        public void Save(BusinessNetworkNamespaceViewModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            bnn.Save(obj);
        }
    }
}