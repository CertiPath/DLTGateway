using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.Common
{
    public class EntityConverter
    {
        public string GetJson(object value)
        {
            // Serialize the entity by ignoring virtual members.
            var e = new ExpandoObject();
            var d = (IDictionary<string, object>)e;

            var pis = value.GetType().GetProperties();
            foreach (var pi in pis)
            {
                if (!pi.GetGetMethod().IsVirtual)
                {
                    d[pi.Name] = pi.GetValue(value);
                }
            }
            var json = JsonConvert.SerializeObject(e);
            return json;
        }
    }
}
