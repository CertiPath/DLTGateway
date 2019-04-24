using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.DataStore
{
    internal class Common
    {
        private DataLayer.DataModelContainer _context;

        public Common(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        /// <summary>
        /// This method is in charge of doing the followings things:
        /// 1) Exclude properties that are deleted
        /// 2) Exclude the properties that are disabled
        /// 3) Exclude the properties that are not visible
        /// 4) Order everything as defined in the ObjectProperty table
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        internal List<PropertyModel> Extract(Guid businessNetworkObjectGUID, string values)
        {
            var properties = _context.BusinessNetworkObjectProperty
                                    .Where(w => w.BusinessNetworkObjectGUID == businessNetworkObjectGUID)
                                    .Where(w => w.Deleted == false)
                                    .Where(w => w.Visible == true)
                                    .Where(w => w.Disabled == false)
                                    .OrderBy(o => o.SortOrder)
                                    .ToList();

            List<PropertyModel> result = new List<PropertyModel>();
            var jsonObject = JsonConvert.DeserializeObject<Dictionary<string, string>>(values);
            foreach (var prop in properties)
            {
                var item = jsonObject.Where(w => w.Key.ToUpper() == prop.Name.ToUpper()).SingleOrDefault();
                if (item.Key != null)
                {
                    result.Add(new PropertyModel()
                    {
                        Name = item.Key,
                        Value = item.Value
                    });
                }
            }
            return result;
        }
    }
}
