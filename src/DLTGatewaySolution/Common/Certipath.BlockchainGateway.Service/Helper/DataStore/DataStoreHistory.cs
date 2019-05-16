using CertiPath.BlockchainGateway.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.DataStore
{
    internal class DataStoreHistory
    {
        DataLayer.DataModelContainer _context;
        internal DataStoreHistory(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        internal void Add(DataLayer.DataStore data)
        {
            CertiPath.BlockchainGateway.DataLayer.DataStoreHistory history =
                new CertiPath.BlockchainGateway.DataLayer.DataStoreHistory()
                {
                    GUID = Guid.NewGuid(),
                    DataStoreGUID = data.GUID,
                    SourceID = data.SourceID,
                    TransactionHistoryGUID = data.TransactionHistoryGUID,
                    Value = data.Value,
                    CreatedOn = data.LastUpdatedOn == null ? DateTime.UtcNow : (DateTime)data.LastUpdatedOn
                };
            
            _context.DataStoreHistory.Add(history);
            _context.SaveChanges();
        }
    }
}
