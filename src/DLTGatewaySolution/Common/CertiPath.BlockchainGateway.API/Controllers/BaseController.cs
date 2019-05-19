using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class BaseController : ApiController
    {
        public DataLayer.DataModelContainer DatabaseContext;

        public BaseController()
        {
            DatabaseContext = DataLayer.DataModelContainer.Builder().Build();
        }
    }
}
