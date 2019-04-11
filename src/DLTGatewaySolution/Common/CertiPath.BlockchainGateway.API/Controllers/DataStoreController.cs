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
            CertiPath.BlockchainGateway.Service.DataStore dsSrv = new Service.DataStore();
            var list = dsSrv.GetAll(model);
            return list;
        }

        public Model.DataStoreModel Get(Guid GUID)
        {
            CertiPath.BlockchainGateway.Service.DataStore dsSrv = new Service.DataStore();
            var result = dsSrv.Get(GUID);
            return result;
        }
    }
}
