using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class SettingController : BaseController
    {
        public List<Model.SettingTypeModel> GetAllTypes()
        {
            Service.Settings settingsSrv = new Service.Settings(DatabaseContext);
            var list = settingsSrv.GetAllTypes();
            return list;
        }

        public List<Model.SettingModel> GetAll(Guid SettingTypeGUID)
        {
            Service.Settings settingsSrv = new Service.Settings(DatabaseContext);
            var list = settingsSrv.GetAll(SettingTypeGUID);
            return list;
        }

        [HttpPost]
        public void Save(List<Model.SettingModel> list)
        {
            Service.Settings settingsSrv = new Service.Settings(DatabaseContext);
            settingsSrv.Save(list);
        }
    }
}
