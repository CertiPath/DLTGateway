using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class User
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
    }

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DataStoreController : ApiController
    {
        [HttpPost]
        public Model.DataStoreTableModel GetAll([FromBody]Model.TableModel model)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.DataStore dsSrv = new Service.DataStore(context);
            var list = dsSrv.GetAll(model);
            return list;
        }

        public Model.DataStoreModel Get(Guid GUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.DataStore dsSrv = new Service.DataStore(context);
            var result = dsSrv.Get(GUID);
            return result;
        }

        public Model.ObjectChartReturnModel GetChart(Guid dataStoreGUID, Guid objectChartGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.DataStore dsSrv = new Service.DataStore(context);
            var result = dsSrv.GetChart(dataStoreGUID, objectChartGUID);
            return result;
        }
    }
}
