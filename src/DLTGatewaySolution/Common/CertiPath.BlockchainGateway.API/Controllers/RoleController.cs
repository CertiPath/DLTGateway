using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RoleController : ApiController
    {
        [HttpPost]
        public Model.RoleTableModel GetAll([FromBody]Model.TableModel model)
        {
            Service.Role roleSrv = new Service.Role();
            var list = roleSrv.GetAll(model);
            return list;
        }
    }
}
