using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class BusinessNetworkObjectController : BaseController
    {
        public List<BusinessNetworkObjectViewModel> GetAllByNamespace(Guid BusinessNetworkNamespaceGUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bnn = new Service.BusinessNetworkObject(DatabaseContext);
            var res = bnn.GetDetailsByNamespace(BusinessNetworkNamespaceGUID);
            return res;
        }

        [HttpPost]
        public void Save(BusinessNetworkObjectViewModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.Save(obj);
        }

        [HttpPost]
        public void Delete(BusinessNetworkObjectViewModel obj)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.Delete(obj);
        }

        public BusinessNetworkObjectDetailsModel GetDetails(Guid BusinessNetworkObjectGUID)
        {
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            var res = bno.GetDetails(BusinessNetworkObjectGUID);
            return res;
        }

        [HttpPost]
        public void SaveProperty(BusinessNetworkObjectPropertyModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.SaveProperty(obj);
        }

        [HttpPost]
        public void DeleteProperty(BusinessNetworkObjectPropertyModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.DeleteProperty(obj);
        }

        public GetObjectChartsModel GetCharts(Guid BusinessNetworkObjectGUID)
        {
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
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.EnableChart(obj.GUID);
        }

        [HttpPost]
        public void DisableChart(BusinessNetworkObjectChartModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.DisableChart(obj.GUID);
        }

        [HttpPost]
        public void DeleteChart(BusinessNetworkObjectChartModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.DeleteChart(obj.GUID);
        }

        [HttpPost]
        public void SaveChart(BusinessNetworkObjectChartModel obj)
        {
            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetworkObject bno = new Service.BusinessNetworkObject(DatabaseContext);
            bno.SaveChart(obj);
        }
    }

}