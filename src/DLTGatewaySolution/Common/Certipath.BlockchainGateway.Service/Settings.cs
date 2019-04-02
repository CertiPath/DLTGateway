using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using AutoMapper;

namespace CertiPath.BlockchainGateway.Service
{
    public class Settings
    {
        public SettingModel Get(GlobalSetting setting)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            var set = context.Setting.Where(w => w.Name == setting.ToString()).SingleOrDefault();

            Model.SettingModel res = new SettingModel();
            if (set == null)
            {
                return null;
            }
            else
            {
                res.Value = set.Value;
            }
            /*
            var config = new MapperConfiguration(cfg => {
                cfg.CreateMap<CertiPath.BlockchainGateway.DataLayer.Setting, SettingModel>();
            });

            IMapper mapper = config.CreateMapper();
            var res = mapper.Map<CertiPath.BlockchainGateway.DataLayer.Setting, SettingModel>(set);
            */
            return res;
        }
    }
}
