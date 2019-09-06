using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class BusinessNetworkObjectController : BaseController
    {
        public List<BusinessNetworkObjectViewModel> GetAllByNamespace(Guid BusinessNetworkNamespaceGUID)
        {
            var bizNetNamespace = DatabaseContext.BusinessNetworkNamespace.Where(w => w.GUID == BusinessNetworkNamespaceGUID).SingleOrDefault();
            if (CanViewNetwork(bizNetNamespace.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bnn = new Service.BusinessNetworkObject(DatabaseContext);
            var res = bnn.GetDetailsByNamespace(BusinessNetworkNamespaceGUID);
            return res;
        }

        [HttpPost]
        public void Save(BusinessNetworkObjectViewModel obj)
        {
            var netObj = DatabaseContext.BusinessNetworkObject.Where(w => w.GUID == obj.BusinessNetworkObjectGUID).SingleOrDefault();
            var bizNetNamespace = DatabaseContext.BusinessNetworkNamespace.Where(w => w.GUID == netObj.BusinessNetworkNamespaceGUID).SingleOrDefault();
            if (CanAdminNetwork(bizNetNamespace.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.Save(obj);
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectViewModel obj)
        {
            var netObj = DatabaseContext.BusinessNetworkObject.Where(w => w.GUID == obj.BusinessNetworkObjectGUID).SingleOrDefault();
            var bizNetNamespace = DatabaseContext.BusinessNetworkNamespace.Where(w => w.GUID == netObj.BusinessNetworkNamespaceGUID).SingleOrDefault();
            if (CanAdminNetwork(bizNetNamespace.BusinessNetworkGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.Delete(obj);
        }

        public BusinessNetworkObjectDetailsModel GetDetails(Guid BusinessNetworkObjectGUID)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectGUID(BusinessNetworkObjectGUID);
            if (CanViewNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            var res = bno.GetDetails(BusinessNetworkObjectGUID);
            return res;
        }

        [HttpPost]
        public void SaveProperty(BusinessNetworkObjectPropertyModel obj)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectGUID(obj.BusinessNetworkObjectGUID);
            if (CanAdminNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.SaveProperty(obj);
        }

        [HttpPost]
        public void DeleteProperty(BusinessNetworkObjectPropertyModel obj)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectPropertyGUID(obj.GUID);
            if (CanAdminNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.DeleteProperty(obj);
        }

        public GetObjectChartsModel GetCharts(Guid BusinessNetworkObjectGUID)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectGUID(BusinessNetworkObjectGUID);
            if (CanViewNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);

            // get charts
            List<BusinessNetworkObjectChartModel> chartList = bno.GetCharts(BusinessNetworkObjectGUID);
            List<ChartCategoryModel> categories = bno.GetChartCategories();
            List<ChartTypeModel> types = bno.GetChartTypes();

            GetObjectChartsModel res = new GetObjectChartsModel()
            {
                ChartList = chartList,
                CategoryList = categories,
                TypeList = types
            };
            return res;
        }

        [HttpPost]
        public void EnableChart(BusinessNetworkObjectChartModel obj)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectChartGUID(obj.GUID);
            if (CanAdminNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }
            
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.EnableChart(obj.GUID);
        }

        [HttpPost]
        public void DisableChart(BusinessNetworkObjectChartModel obj)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectChartGUID(obj.GUID);
            if (CanAdminNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.DisableChart(obj.GUID);
        }

        [HttpPost]
        public void DeleteChart(BusinessNetworkObjectChartModel obj)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectChartGUID(obj.GUID);
            if (CanAdminNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.DeleteChart(obj.GUID);
        }

        [HttpPost]
        public void SaveChart(BusinessNetworkObjectChartModel obj)
        {
            Guid bizNetGUID = getBusinessNetworkGUIDByObjectGUID(obj.BusinessNetworkObjectGUID);
            if (CanAdminNetwork(bizNetGUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.SaveChart(obj);
        }

        private Guid getBusinessNetworkGUIDByObjectGUID(Guid BusinessNetworkObjectGUID)
        {
            var netObj = DatabaseContext.BusinessNetworkObject.Where(w => w.GUID == BusinessNetworkObjectGUID).SingleOrDefault();
            var bizNetNamespace = DatabaseContext.BusinessNetworkNamespace.Where(w => w.GUID == netObj.BusinessNetworkNamespaceGUID).SingleOrDefault();
            return bizNetNamespace.BusinessNetworkGUID;
        }

        private Guid getBusinessNetworkGUIDByObjectPropertyGUID(Guid propertyGUID)
        {
            var prop = DatabaseContext.BusinessNetworkObjectProperty.Where(w => w.GUID == propertyGUID).SingleOrDefault();
            return getBusinessNetworkGUIDByObjectGUID(prop.BusinessNetworkObjectGUID);
        }
        private Guid getBusinessNetworkGUIDByObjectChartGUID(Guid chartGUID)
        {
            var chart = DatabaseContext.BusinessNetworkObjectChart.Where(w => w.GUID == chartGUID).SingleOrDefault();
            return getBusinessNetworkGUIDByObjectGUID(chart.BusinessNetworkObjectGUID);
        }

    }

}