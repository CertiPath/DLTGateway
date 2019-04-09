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
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bnn = new Service.BusinessNetworkObject();
            var res = bnn.GetDetailsByNamespace(BusinessNetworkNamespaceGUID);
            return res;
        }

        [HttpPost]
        public void Save(BusinessNetworkObjectViewModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject();
            bno.Save(obj);
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectViewModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject();
            bno.Delete(obj);
        }

        public BusinessNetworkObjectDetailsModel GetDetails(Guid BusinessNetworkObjectGUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject();
            var res = bno.GetDetails(BusinessNetworkObjectGUID);
            return res;
        }

        [HttpPost]
        public void SaveProperty(BusinessNetworkObjectPropertyModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject();
            bno.SaveProperty(obj);
        }

        [HttpPost]
        public void DeleteProperty(BusinessNetworkObjectPropertyModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject();
            bno.DeleteProperty(obj);
        }
    }

}