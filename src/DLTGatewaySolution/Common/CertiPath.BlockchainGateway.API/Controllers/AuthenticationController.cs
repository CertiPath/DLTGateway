using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class AuthenticationController : ApiController
    {
        [HttpPost]
        public AuthenticationResponseModel Login(AuthenticationModel model)
        {
            CertiPath.BlockchainGateway.Service.Authenticate authSrv = new Service.Authenticate();
            var res = authSrv.Login(model);
            return res;
        }
    }
}
