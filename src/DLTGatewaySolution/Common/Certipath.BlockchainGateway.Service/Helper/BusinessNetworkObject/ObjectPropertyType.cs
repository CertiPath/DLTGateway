using CertiPath.BlockchainGateway.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.BusinessNetworkObject
{
    internal class ObjectPropertyType
    {
        DataLayer.DataModelContainer _context;
        internal ObjectPropertyType(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        internal Guid GetByCode(string code)
        {
            // TODO: this is being used since we are hardcoding values on the front end
            // to load values from database; and clear this up
            var type = _context.ObjectPropertyType.Where(w => w.Code == code).SingleOrDefault();
            return type.GUID;
        }
    }
}
