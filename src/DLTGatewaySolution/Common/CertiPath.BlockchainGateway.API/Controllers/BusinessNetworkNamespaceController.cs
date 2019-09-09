using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace CertiPath.BlockchainGateway.API.Controllers
{
     public class BusinessNetworkNamespaceController : BaseController
     {
       
        public List<BusinessNetworkNamespaceViewModel> GetAll(Guid BusinessNetworkGUID)
        {
            if (CanViewNetwork(BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            var res = bnn.GetAllByBusinessNetwork(BusinessNetworkGUID);
            return res;
        }

        public BusinessNetworkNamespaceModel GetDetails(Guid GUID)
        {
            var bizNetNamespace = DatabaseContext.BusinessNetworkNamespace.Where(w => w.GUID == GUID).SingleOrDefault();
            if (CanViewNetwork(bizNetNamespace.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            var res = bnn.GetDetails(GUID);

            bool lCanAdmin = CanAdminNetwork(bizNetNamespace.BusinessNetworkGUID);
            res.ReadOnly = !lCanAdmin;

            return res;
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectModel obj)
        {
            var bizNetNamespace = DatabaseContext.BusinessNetworkNamespace.Where(w => w.GUID == obj.GUID).SingleOrDefault();
            if (CanAdminNetwork(bizNetNamespace.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            bnn.Delete(obj.GUID);
        }

        [HttpPost]
        public void Save(BusinessNetworkNamespaceViewModel obj)
        {
            if (CanAdminNetwork(obj.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkNamespace bnn = new Service.BusinessNetworkNamespace(DatabaseContext);
            bnn.Save(obj);
        }
    }
}