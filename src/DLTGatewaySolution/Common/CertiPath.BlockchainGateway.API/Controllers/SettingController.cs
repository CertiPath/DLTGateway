using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class SettingController : ApiController
    {
        public List<Model.SettingTypeModel> GetAllTypes()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Settings settingsSrv = new Service.Settings(context);
            var list = settingsSrv.GetAllTypes();
            return list;
        }

        public List<Model.SettingModel> GetAll(Guid SettingTypeGUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Settings settingsSrv = new Service.Settings(context);
            var list = settingsSrv.GetAll(SettingTypeGUID);
            return list;
        }

        [HttpPost]
        public void Save(List<Model.SettingModel> list)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            Service.Settings settingsSrv = new Service.Settings(context);
            settingsSrv.Save(list);
        }
    }
}
