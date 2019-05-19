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
        private DataModelContainer _context;
        private Helper.Common.EntityConverter _converter;

        public Settings(DataModelContainer context)
        {
            _context = context;
            _converter = new Helper.Common.EntityConverter();
        }

        public List<Model.SettingTypeModel> GetAllTypes()
        {
            var settingTypes = _context.SettingType
                                        .Where(w => w.UserEditable == true)
                                        .OrderBy(o => o.Order)
                                        .ToList();
            List<Model.SettingTypeModel> resList = new List<SettingTypeModel>();
            foreach (var type in settingTypes)
            {
                resList.Add(new SettingTypeModel()
                {
                    Name = type.Name,
                    DisplayName = type.DisplayName,
                    GUID = type.GUID
                });
            }
            return resList;
        }

        public void Save(List<SettingModel> list)
        {
            foreach (var item in list)
            {
                var setting = _context.Setting.Where(w => w.GUID == item.GUID).SingleOrDefault();
                setting.Value = item.Value;
                string orig = _converter.GetJson(setting);
                _context.SaveChanges();

                Helper.Audit.AuditLog alo = new Helper.Audit.AuditLog(_context);
                AuditLogModel alm = new AuditLogModel()
                {
                    OperationType = AuditLogOperationType.Update,
                    PrimaryObjectGUID = item.GUID,
                    PrimaryObjectType = AuditLogObjectType.Setting,
                    SecondaryObjectGUID = null,
                    SecondaryObjectType = null,
                    NewRecordValue = _converter.GetJson(item),
                    OldRecordValue = orig
                };
                alo.Save(alm);
            }
        }

        public List<Model.SettingModel> GetAll(Guid settingTypeGUID)
        {
            var settings = _context.Setting
                                    .Where(w => w.SettingTypeGUID == settingTypeGUID)
                                    .Where(w => w.UserEditable)
                                    .OrderBy(o => o.Order)
                                    .ToList();

            List<Model.SettingModel> result = new List<SettingModel>();
            foreach (var setting in settings)
            {
                result.Add(new SettingModel() {
                    DisplayName = setting.DisplayName,
                    GUID = setting.GUID,
                    Name = setting.Name,
                    Required = setting.Required,
                    SettingTypeGUID = setting.SettingTypeGUID,
                    TooltipText = setting.TooltipText,
                    Value = setting.Value,
                    ValueReference = setting.ValueReference,
                    ValueType = setting.ValueType
                });
            }
            return result;
        }

        public SettingModel Get(GlobalSetting setting)
        {
            var set = _context.Setting.Where(w => w.Name == setting.ToString()).SingleOrDefault();

            Model.SettingModel res = new SettingModel();
            if (set == null)
            {
                return null;
            }
            else
            {
                res.Value = set.Value;
            }
            return res;
        }
    }
}
