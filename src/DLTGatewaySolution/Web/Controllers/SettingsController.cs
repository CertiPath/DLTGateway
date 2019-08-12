using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace CertiPath.BlockchainGateway.Web.Controllers
{
    [Route("web/settings")]
    public class SettingsController : Controller
    {
        private readonly IOptions<AppSettings> config;

        public SettingsController(IOptions<AppSettings> config)
        {
            this.config = config;
        }

        [HttpGet("apiurl")]
        public String GetApiUrl()
        {
            return config.Value.ApiUrl;
        }
    }
}
